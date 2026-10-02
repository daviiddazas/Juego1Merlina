import React, { useState } from 'react';
import { NEVERMORE_ASSETS } from '../assets/imagePaths';
import { gothicAudio } from '../utils/audio';

export const OpheliaWindowSection: React.FC = () => {
  const [sliderVal, setSliderVal] = useState(50);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-purple-400 font-['Cinzel'] font-bold">
          Dormitorio 103 · Ophelia Hall
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-100 font-['Cinzel']">
          El Vitral de la Dualidad
        </h2>
        <p className="text-neutral-400 text-sm font-serif italic">
          La mitad izquierda destila la penumbra gótica de Wednesday; la mitad derecha estalla con los arcoíris y la purpurina de Enid.
        </p>
      </div>

      {/* Interactive Stained Glass Showcase */}
      <div className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-purple-900/60 shadow-[0_0_40px_rgba(75,29,109,0.4)] bg-[#07050a]">
        <div className="relative aspect-square w-full">
          <img
            src={NEVERMORE_ASSETS.opheliaWindow}
            alt="Ventana de Ophelia Hall"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Dynamic Light Overlay responding to slider */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity"
            style={{
              background: `linear-gradient(to right, rgba(0,0,0,${0.6 - sliderVal * 0.005}) 0%, transparent 50%, rgba(236,72,153,${sliderVal * 0.003}) 100%)`,
            }}
          />
        </div>

        {/* Slider Controls */}
        <div className="p-5 bg-[#0b0813] border-t border-purple-950 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-['Cinzel'] font-bold">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <span>🖤</span>
              <span>Monocromo Gótico (Wednesday)</span>
            </span>
            <span className="text-pink-400 flex items-center gap-1.5">
              <span>🌈</span>
              <span>Policromo Radiante (Enid)</span>
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={(e) => {
              setSliderVal(Number(e.target.value));
            }}
            onMouseUp={() => gothicAudio.playParchment()}
            className="w-full accent-purple-500 cursor-pointer"
          />

          <p className="text-[12px] text-neutral-400 text-center font-serif italic">
            {sliderVal < 35
              ? '«El blanco y negro es el único espectro en el que el mundo adquiere decencia y silencio.» — Wednesday'
              : sliderVal > 65
              ? '«¡Si no hay al menos siete colores fosforescentes, la habitación parece un mausoleo abandonado!» — Enid'
              : '«El equilibrio perfecto entre un asesinato perfecto y un ataque de felicidad.»'}
          </p>
        </div>
      </div>
    </div>
  );
};
