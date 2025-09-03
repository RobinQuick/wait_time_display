import React, { useState, useEffect } from 'react';
import QuickLogo from '../components/QuickLogo';
import CountdownRing from '../components/CountdownRing';
import { useWaitTime } from '../hooks/useWaitTime';
import { getProductByOffer } from '../data/products';

export default function DisplayScreen() {
  const { data, isConnected } = useWaitTime();
  const [lastUpdate, setLastUpdate] = useState<string>('–');
  const [isFlipping, setIsFlipping] = useState(false);
  const [prevWaitTime, setPrevWaitTime] = useState(data.waitTime);

  const product = data.hasOffer ? getProductByOffer(data.offer) : null;

  useEffect(() => {
    if (data.waitTime !== prevWaitTime) {
      setIsFlipping(true);
      setTimeout(() => setIsFlipping(false), 650);
      setPrevWaitTime(data.waitTime);
    }
    setLastUpdate(new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }));
  }, [data.waitTime, data.offer, prevWaitTime]);

  const getFontSize = (waitTime: number) => {
    if (waitTime < 10) return 'text-[min(20vh,220px)]';
    if (waitTime < 30) return 'text-[min(17vh,200px)]';
    return 'text-[min(15vh,180px)]';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-quick-red to-quick-red-dark relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-8">
        <div 
          className="absolute inset-0 bg-no-repeat bg-center"
          style={{
            backgroundImage: 'url(/static/quick-logo.jpg)',
            backgroundSize: 'min(32vw, 320px)',
            backgroundPosition: 'center 20%',
            filter: 'blur(1px) contrast(120%)'
          }}
        />
      </div>
      
      <div className="absolute inset-[-10%] animate-sweep opacity-20 pointer-events-none">
        <div className="w-full h-full bg-gradient-conic from-white/10 via-transparent to-white/8" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          <QuickLogo size="xl" className="scale-150" />
        </header>

        {/* Main Display Panel */}
        <section className="relative glass-card max-w-6xl w-full text-center overflow-hidden">
          {/* Animated light sweep */}
          <div className="absolute inset-[-40%] -z-10 bg-gradient-to-r from-transparent via-white/12 to-transparent transform -translate-x-[30%] rotate-8 animate-panel-sweep pointer-events-none" />
          
          <div className="space-y-8 py-16 px-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Ici vous serez servi en
            </h1>

            {/* Wait Time Display */}
            <div className="relative inline-grid place-items-center my-12">
              <div className={`
                ${getFontSize(data.waitTime)} font-black text-white leading-none relative z-10
                ${isFlipping ? 'animate-flip' : ''}
              `}>
                {data.waitTime}
              </div>
              
              <CountdownRing 
                minutes={data.waitTime} 
                className="scale-125" 
              />
            </div>

            <div className="text-3xl md:text-4xl font-bold text-white/90">
              {data.waitTime === 1 ? 'minute' : 'minutes'}
            </div>

            {/* Offer Section */}
            {data.hasOffer && data.offer && (
              <div className="flex items-center justify-center gap-6 flex-wrap mt-16">
                <span className="text-2xl md:text-3xl font-semibold text-white">
                  Sinon, on vous offre {data.offer}
                </span>
                {product && (
                  <img
                    src={product.image}
                    alt={`Produit offert : ${data.offer}`}
                    className="h-24 md:h-32 w-auto bg-white rounded-2xl p-3 shadow-2xl animate-float"
                  />
                )}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto flex gap-6 text-white/80">
          <div className="bg-black/25 px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            Affichage temps réel
          </div>
          <div className="bg-black/25 px-4 py-2 rounded-xl border border-white/20">
            Dernière mise à jour : {lastUpdate}
          </div>
        </footer>
      </div>

      {/* Ambient Glow Effects for 46" Display */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-300/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: '1.5s' }} />
      
      {/* Shimmer overlay for premium feel */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}