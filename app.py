import os, asyncio
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="QSR Wait Time", version="0.2.0")

# Add CORS middleware for modern web standards
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# ---- ÉTAT EN MÉMOIRE ----
WAIT_TIME = 10                      # minutes
OFFER = ""                          # offre par défaut (vide = pas d'offre)
listeners: set[asyncio.Queue] = set()

async def notify():
    """Diffuse WAIT_TIME et OFFER à tous les clients via SSE."""
    data = f"data: {WAIT_TIME}|{OFFER}\n\n"
    for q in list(listeners):
        await q.put(data)

# ---- SERVE STATIC FILES ----
@app.get("/")
@app.get("/display")
@app.get("/control")
async def serve_spa():
    """Serve the React SPA for all routes"""
    with open("dist/index.html", "r") as f:
        return HTMLResponse(content=f.read())

# ---- API TEMPS ----
@app.get("/api/wait")
async def get_wait():
    return JSONResponse({"wait": WAIT_TIME})

@app.post("/api/wait")
async def set_wait(value: int = Form(...), pin: str = Form(None)):
    global WAIT_TIME
    WAIT_TIME = max(0, int(value))
    await notify()
    return JSONResponse({"ok": True, "wait": WAIT_TIME})

# ---- API OFFRE ----
@app.get("/api/offer")
async def get_offer():
    return JSONResponse({"offer": OFFER, "hasOffer": bool(OFFER.strip())})

@app.post("/api/offer")
async def set_offer(value: str = Form(...)):
    global OFFER
    OFFER = value.strip()
    await notify()
    return JSONResponse({"ok": True, "offer": OFFER, "hasOffer": bool(OFFER.strip())})

# ---- SSE ----
from starlette.background import BackgroundTask

@app.get("/stream")
async def stream():
    async def gen(q: asyncio.Queue):
        # valeur initiale
        yield f"data: {WAIT_TIME}|{OFFER}\n\n"
        try:
            while True:
                data = await q.get()
                yield data
        except asyncio.CancelledError:
            pass

    q: asyncio.Queue = asyncio.Queue()
    listeners.add(q)

    return StreamingResponse(
        gen(q),
        media_type="text/event-stream",
        background=BackgroundTask(lambda: listeners.discard(q))
    )

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return JSONResponse({"status": "healthy", "wait_time": WAIT_TIME, "offer": OFFER})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)