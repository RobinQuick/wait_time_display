import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

interface WaitTimeControlsProps {
  value: number;
  onChange: (value: number) => void;
}

export default function WaitTimeControls({ value, onChange }: WaitTimeControlsProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: number) => {
    const clampedValue = Math.max(0, Math.min(180, newValue));
    setLocalValue(clampedValue);
    onChange(clampedValue);
  };

  const presets = [5, 10, 15, 20, 30];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white/95">Réglage rapide</h2>
      
      <div className="flex items-center gap-3">
        <button
          className="btn-primary w-12 h-12"
          onClick={() => handleChange(localValue - 5)}
        >
          <Minus size={20} />
        </button>
        <button
          className="btn-primary w-12 h-12"
          onClick={() => handleChange(localValue - 1)}
        >
          <Minus size={16} />
        </button>
        
        <input
          type="number"
          value={localValue}
          onChange={(e) => handleChange(parseInt(e.target.value) || 0)}
          className="input-field text-center min-w-0 flex-1"
          min="0"
          max="180"
        />
        
        <button
          className="btn-primary w-12 h-12"
          onClick={() => handleChange(localValue + 1)}
        >
          <Plus size={16} />
        </button>
        <button
          className="btn-primary w-12 h-12"
          onClick={() => handleChange(localValue + 5)}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max="180"
          value={localValue}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer slider"
        />
        
        <div className="flex gap-2 flex-wrap">
          {presets.map(preset => (
            <button
              key={preset}
              onClick={() => handleChange(preset)}
              className="px-3 py-1 bg-black/20 border border-white/20 text-white rounded-full text-sm font-bold hover:bg-white/10 transition-colors"
            >
              {preset} min
            </button>
          ))}
        </div>
      </div>
    </div>
  );