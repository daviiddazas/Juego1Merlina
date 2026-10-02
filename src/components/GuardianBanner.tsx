import React from 'react';
import { Sparkles, Skull, Scroll, Layers } from 'lucide-react';
import { gothicAudio } from '../utils/audio';

interface GuardianBannerProps {
  currentMessage: string;
  quizMode: 'step' | 'scroll';
  onToggleMode: (mode: 'step' | 'scroll') => void;
  isCompleted: boolean;
}

export const GuardianBanner: React.FC<GuardianBannerProps> = ({
  currentMessage,
  quizMode,
  onToggleMode,
  isCompleted,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-purple-950/80 bg-gradient-to-b from-[#120d1c] via-[#0d0915] to-[#07050a] p-5 sm:p-7 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
      {/* Subtle gothic tracery background lighting */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-stone-900/40 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          {/* Guardian Icon & Raven Sigil */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-lg bg-neutral-900 border border-purple-800/60 flex items-center justify-center text-purple-300 shadow-[inset_0_0_12px_rgba(147,51,234,0.25)]">
              <Skull className="w-7 h-7 text-purple-400 stroke-[1.5]" />
            </div>
            <span className="absolute -bottom-1 -right-1 text-xs" title="Nevermore Guardian">
              🦇
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-purple-400 font-['Cinzel'] font-bold">
                Guardián del Sombrío Portal
              </span>
              <span className="text-neutral-500 text-xs font-mono">· Maestro de Ceremonias</span>
            </div>

            <p className="mt-1.5 text-neutral-300 text-sm md:text-base italic font-serif leading-relaxed max-w-2xl border-l-2 border-purple-800/80 pl-3">
              &ldquo;{currentMessage}&rdquo;
            </p>
          </div>
        </div>

        {/* Controls & Mode Switcher */}
        {!isCompleted && (
          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={() => {
                gothicAudio.playCello(130.81, 2.2);
              }}
              title="Escuchar una nota de violonchelo sombrío"
              className="px-3 py-1.5 text-xs text-neutral-300 hover:text-purple-200 bg-neutral-900/80 hover:bg-purple-950/50 border border-neutral-800 hover:border-purple-800 rounded transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <span>🎻</span>
              <span>Tocar Celo</span>
            </button>

            {/* Mode Selector */}
            <div className="flex items-center p-0.5 bg-neutral-950/80 border border-purple-950 rounded-lg">
              <button
                onClick={() => {
                  onToggleMode('step');
                  gothicAudio.playParchment();
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  quizMode === 'step'
                    ? 'bg-purple-950 text-purple-200 border border-purple-800 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Paso a Paso</span>
              </button>
              <button
                onClick={() => {
                  onToggleMode('scroll');
                  gothicAudio.playParchment();
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  quizMode === 'scroll'
                    ? 'bg-purple-950 text-purple-200 border border-purple-800 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Scroll className="w-3.5 h-3.5" />
                <span>Grimorio Completo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
