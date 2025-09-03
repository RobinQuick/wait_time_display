import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DisplayScreen from './pages/DisplayScreen'
import ControlPanel from './pages/ControlPanel'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DisplayScreen />} />
        <Route path="/display" element={<DisplayScreen />} />
        <Route path="/control" element={<ControlPanel />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)