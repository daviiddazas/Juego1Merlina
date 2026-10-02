import React, { useState } from 'react';
import { Volume2, VolumeX, Music, RefreshCw } from 'lucide-react';
import { gothicAudio } from '../utils/audio';

interface HeaderProps {
  currentTab: 'quiz' | 'window' | 'roster';
  onSelectTab: (tab: 'quiz' | 'window' | 'roster') => void;
  onResetQuiz: () => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onResetQuiz,
  hasResult,
}) => {
  const [muted, setMuted] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);

  const handleToggleMute = () => {
    const isNowMuted = gothicAudio.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      gothicAudio.playParchment();
    }
  };

  const handleToggleAmbient = () => {
    const isPlaying = gothicAudio.toggleAmbient();
    setAmbientPlaying(isPlaying);
    if (isPlaying) {
      gothicAudio.playBell();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#08070b]/90 backdrop-blur-md border-b border-purple-950/60 px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            onSelectTab('quiz');
            gothicAudio.playParchment();
          }}
          className="text-left group cursor-pointer"
        >
          <span className="text-base md:text-xl font-bold tracking-wider text-neutral-100 uppercase transition-colors group-hover:text-purple-300 font-['Cinzel'] whitespace-nowrap">
            ¿Quién Eres en Nevermore?
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="flex items-center gap-2 sm:gap-6 text-xs md:text-sm font-medium text-neutral-400">
          <button
            onClick={() => {
              onSelectTab('quiz');
              gothicAudio.playParchment();
            }}
            className={`transition-colors py-1 cursor-pointer whitespace-nowrap ${
              currentTab === 'quiz'
                ? 'text-purple-300 border-b-2 border-purple-500 font-semibold'
                : 'hover:text-neutral-200'
            }`}
          >
            El Portal
          </button>
          <button
            onClick={() => {
              onSelectTab('window');
              gothicAudio.playParchment();
            }}
            className={`transition-colors py-1 cursor-pointer whitespace-nowrap ${
              currentTab === 'window'
                ? 'text-purple-300 border-b-2 border-purple-500 font-semibold'
                : 'hover:text-neutral-200'
            }`}
          >
            Ventana Ophelia
          </button>
          <button
            onClick={() => {
              onSelectTab('roster');
              gothicAudio.playParchment();
            }}
            className={`transition-colors py-1 cursor-pointer whitespace-nowrap ${
              currentTab === 'roster'
                ? 'text-purple-300 border-b-2 border-purple-500 font-semibold'
                : 'hover:text-neutral-200'
            }`}
          >
            Expedientes
          </button>
        </nav>

        {/* Zone 3: Primary actions & Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleToggleAmbient}
            title={ambientPlaying ? 'Detener eco gótico' : 'Activar eco ambiental de Nevermore'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${
              ambientPlaying
                ? 'bg-purple-950/80 text-purple-200 border-purple-600 shadow-[0_0_12px_rgba(147,51,234,0.3)]'
                : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${ambientPlaying ? 'animate-pulse text-purple-400' : ''}`} />
            <span className="hidden sm:inline">Eco</span>
          </button>

          <button
            onClick={handleToggleMute}
            title={muted ? 'Activar sonido' : 'Silenciar'}
            className="p-1.5 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-neutral-800/80 transition-colors cursor-pointer"
            aria-label="Silenciar o activar efectos"
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
          </button>

          {hasResult && (
            <button
              onClick={() => {
                gothicAudio.playParchment();
                onResetQuiz();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-200 bg-purple-950 hover:bg-purple-900 border border-purple-800 rounded transition-all cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reiniciar Ritual</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
