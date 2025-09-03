import React, { useState, useEffect } from 'react';
import { Save, Trash2 } from 'lucide-react';
import QuickLogo from '../components/QuickLogo';
import WaitTimeControls from '../components/WaitTimeControls';
import ProductTile from '../components/ProductTile';
import { useWaitTime } from '../hooks/useWaitTime';
import { products } from '../data/products';
import { Product } from '../types';

export default function ControlPanel() {
  const { data, updateWaitTime, updateOffer, removeOffer } = useWaitTime();
  const [waitTime, setWaitTime] = useState(data.waitTime);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pin, setPin] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setWaitTime(data.waitTime);
    
    // Find selected product based on current offer
    if (data.hasOffer && data.offer) {
      const product = products.find(p => 
        data.offer.toLowerCase().includes(p.name.toLowerCase()) ||
        p.offer.toLowerCase().includes(data.offer.toLowerCase())
      );
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
  }, [data]);

  const handleSave = async () => {
    const success = await updateWaitTime(waitTime, pin);
    if (success && selectedProduct) {
      await updateOffer(selectedProduct.offer);
    }
    if (success) {
      showToastMessage('✅ Mis à jour');
    }
  };

  const handleSaveOffer = async () => {
    if (selectedProduct) {
      const success = await updateOffer(selectedProduct.offer);
      if (success) {
        showToastMessage('✅ Offre mise à jour');
      }
    }
  };

  const handleRemoveOffer = async () => {
    const success = await removeOffer();
    if (success) {
      setSelectedProduct(null);
      showToastMessage('✅ Offre supprimée');
    }
  };

  const showToastMessage = (message: string) => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1600);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setWaitTime(prev => Math.min(180, prev + (e.shiftKey ? 5 : 1)));
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setWaitTime(prev => Math.max(0, prev - (e.shiftKey ? 5 : 1)));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-quick-red to-quick-red-dark">
      {/* Hidden classes to ensure Tailwind generates them */}
      <div className="hidden bg-white/[0.08] bg-white/[0.12]"></div>
      
      <header className="flex justify-center py-6">
        <QuickLogo size="lg" />
        <span className="ml-4 text-white font-black text-2xl self-end">Contrôle</span>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-[1.15fr_1fr] gap-6 px-6 pb-8">
        {/* Controls Column */}
        <section className="glass-card space-y-6">
          <h1 className="text-2xl font-bold text-white">Temps d'attente</h1>

          <WaitTimeControls value={waitTime} onChange={setWaitTime} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white/95">Offre</h2>
              {selectedProduct && (
                <button
                  onClick={handleRemoveOffer}
                  className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-200 rounded-lg border border-red-400/30 hover:bg-red-500/30 transition-colors text-sm"
                >
                  <Trash2 size={14} />
                  Supprimer l'offre
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map(product => (
                <ProductTile
                  key={product.id}
                  product={product}
                  isActive={selectedProduct?.id === product.id}
                  isDisabled={false}
                  onSelect={setSelectedProduct}
                  onRemove={() => setSelectedProduct(null)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white/95">Validation</h2>
            <div className="flex gap-3">
              <input
                type="password"
                placeholder="PIN (facultatif)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="input-field"
              />
              <button onClick={handleSave} className="btn-primary">
                <Save size={18} className="mr-2" />
                Enregistrer
              </button>
              <button onClick={handleSaveOffer} className="btn-ghost">
                Sauver l'offre seule
              </button>
            </div>
            
            <p className="text-white/70 text-sm">
              Raccourcis : <kbd className="bg-black/30 border border-white/30 px-2 py-1 rounded text-xs">←</kbd>/<kbd className="bg-black/30 border border-white/30 px-2 py-1 rounded text-xs">→</kbd> = -/+ 1 •
              <kbd className="bg-black/30 border border-white/30 px-2 py-1 rounded text-xs">Shift</kbd>+<kbd className="bg-black/30 border border-white/30 px-2 py-1 rounded text-xs">←/→</kbd> = -/+ 5 •
              <kbd className="bg-black/30 border border-white/30 px-2 py-1 rounded text-xs">Enter</kbd> = Enregistrer
            </p>
          </div>
        </section>

        {/* Preview Column */}
        <aside className="glass-card">
          <h1 className="text-2xl font-bold text-white mb-4">Aperçu live</h1>
          <div className="relative overflow-hidden rounded-2xl min-h-96">
            <iframe
              src="/display"
              className="w-full h-96 border-0 rounded-2xl transform scale-75 origin-top shadow-2xl pointer-events-none"
              title="Aperçu du display"
            />
          </div>
          <p className="text-white/70 text-sm mt-3">
            Aperçu non interactif (sécurisé). Le display réel se met à jour en temps réel.
          </p>
        </aside>
      </main>

      {/* Toast Notification */}
      <div className={`
        fixed bottom-6 right-6 z-50 bg-black/80 text-white px-4 py-3 rounded-xl border border-white/20 shadow-2xl
        transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}
      `}>
        ✅ Mis à jour
      </div>
    </div>
  );
}