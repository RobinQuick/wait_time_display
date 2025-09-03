import React from 'react';
import { X } from 'lucide-react';
import { Product } from '../types';

interface ProductTileProps {
  product: Product;
  isActive: boolean;
  isDisabled: boolean;
  onSelect: (product: Product) => void;
  onRemove: (product: Product) => void;
}

export default function ProductTile({ 
  product, 
  isActive, 
  isDisabled, 
  onSelect, 
  onRemove 
}: ProductTileProps) {
  return (
    <div className="relative group">
      <div
        className={`
          relative cursor-pointer text-center p-3 rounded-2xl border transition-all duration-200
          ${isDisabled ? 'opacity-50 pointer-events-none' : ''}
          ${isActive 
            ? 'bg-white text-quick-red-dark shadow-2xl border-transparent transform -translate-y-1' 
            : 'bg-black/20 text-white border-white/20 hover:bg-white/10 hover:-translate-y-1'
          }
        `}
        onClick={() => onSelect(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-h-16 w-auto mx-auto mb-2 bg-white rounded-xl p-2 shadow-lg"
        />
        <div className="text-sm font-bold">{product.name}</div>
      </div>
      
      {isActive && !isDisabled && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(product);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-quick-red text-white rounded-full flex items-center justify-center shadow-lg hover:bg-quick-red-dark transition-colors z-10"
          title="Retirer cette offre"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}