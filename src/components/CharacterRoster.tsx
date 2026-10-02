import React, { useState } from 'react';
import { CHARACTERS } from '../data/nevermoreData';
import { Character, CharacterId } from '../types';
import { CHARACTER_PORTRAITS } from '../assets/imagePaths';
import { gothicAudio } from '../utils/audio';
import { copyToClipboard } from '../utils/clipboard';
import { Copy, Check } from 'lucide-react';

export const CharacterRoster: React.FC = () => {
  const [selectedId, setSelectedId] = useState<CharacterId>('wednesday');
  const [filter, setFilter] = useState<'all' | 'addams' | 'nevermore'>('all');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const character = CHARACTERS[selectedId];
  const portraitUrl = CHARACTER_PORTRAITS[character.id];

  const handleCopyPrompt = async (prompt: string) => {
    await copyToClipboard(prompt);
    setCopiedPrompt(true);
    gothicAudio.playParchment();
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const characterIds = (Object.keys(CHARACTERS) as CharacterId[]).filter((cId) => {
    if (filter === 'addams') return CHARACTERS[cId].isAddamsFamily;
    if (filter === 'nevermore') return !CHARACTERS[cId].isAddamsFamily;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-purple-400 font-['Cinzel'] font-bold">
          Archivos Confidenciales de Nunca Más & Mansión Addams
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-100 font-['Cinzel']">
          Expedientes de los Personajes
        </h2>
        <p className="text-neutral-400 text-sm font-serif italic">
          Explora los expedientes de la Familia Addams y los estudiantes excluidos de Nevermore.
        </p>

        {/* Filter Segmented Control */}
        <div className="inline-flex p-1 bg-neutral-950/80 border border-purple-950 rounded-lg mt-3">
          <button
            onClick={() => {
              setFilter('all');
              gothicAudio.playParchment();
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-purple-950 text-purple-200 border border-purple-800'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Todos ({Object.keys(CHARACTERS).length})
          </button>
          <button
            onClick={() => {
              setFilter('addams');
              gothicAudio.playParchment();
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
              filter === 'addams'
                ? 'bg-purple-950 text-purple-200 border border-purple-800'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Familia Addams (6)
          </button>
          <button
            onClick={() => {
              setFilter('nevermore');
              gothicAudio.playParchment();
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
              filter === 'nevermore'
                ? 'bg-purple-950 text-purple-200 border border-purple-800'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Excluidos Nevermore (4)
          </button>
        </div>
      </div>

      {/* Character Selector Grid with Photos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {characterIds.map((cId) => {
          const char = CHARACTERS[cId];
          const isSelected = selectedId === cId;
          const photo = CHARACTER_PORTRAITS[cId];

          return (
            <button
              key={cId}
              onClick={() => {
                setSelectedId(cId);
                gothicAudio.playParchment();
              }}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 group ${
                isSelected
                  ? 'bg-purple-950/80 border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)] ring-1 ring-purple-500/50'
                  : 'bg-[#0d0914] border-neutral-800/80 hover:border-purple-900 hover:bg-[#120e1d]'
              }`}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border border-neutral-700 bg-neutral-900 relative group-hover:border-purple-600 transition-colors shrink-0">
                {photo ? (
                  <img
                    src={photo}
                    alt={char.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="text-xl flex items-center justify-center h-full">{char.emoji}</span>
                )}
              </div>
              <div className="min-w-0 w-full">
                <span className="text-xs font-bold text-neutral-200 font-['Cinzel'] truncate block">
                  {char.name}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono block">
                  {char.isAddamsFamily ? 'Familia Addams' : 'Nevermore'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Character Deep Dossier */}
      <div className="rounded-2xl border border-purple-900/60 bg-[#0d0915] p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-b border-purple-950/80 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-600/80 shadow-[0_0_15px_rgba(147,51,234,0.3)] shrink-0 bg-neutral-950">
              {portraitUrl ? (
                <img
                  src={portraitUrl}
                  alt={character.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-3xl">
                  {character.emoji}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono text-purple-400">
                  {character.outcastTitle}
                </span>
                {character.isAddamsFamily && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800 px-1.5 py-0.5 rounded font-mono">
                    Addams
                  </span>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-neutral-100 font-['Cinzel']">
                {character.name}
              </h3>
              <p className="text-xs font-serif text-neutral-400 italic">
                {character.seriesRole}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-mono text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800">
              {character.dormitory}
            </span>
          </div>
        </div>

        {/* Dossier details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs uppercase font-['Cinzel'] text-purple-400 font-bold mb-1">
                Superpoder / Habilidad
              </h4>
              <p className="text-sm font-semibold text-neutral-200">
                {character.superpower}
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase font-['Cinzel'] text-purple-400 font-bold mb-1">
                Frase Emblemática
              </h4>
              <p className="text-sm font-serif italic text-purple-200 border-l-2 border-purple-700 pl-3">
                &ldquo;{character.iconicQuote}&rdquo;
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase font-['Cinzel'] text-purple-400 font-bold mb-1">
                Círculo / Sociedad Secreta
              </h4>
              <p className="text-xs font-mono text-neutral-300">
                {character.secretSociety}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs uppercase font-['Cinzel'] text-purple-400 font-bold mb-1">
                Rasgos y Fortalezas
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {character.strengths.map((str, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
                  >
                    ✦ {str}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase font-['Cinzel'] text-purple-400 font-bold mb-1">
                Perfil de Personalidad
              </h4>
              <p className="text-xs md:text-sm text-neutral-300 font-serif leading-relaxed">
                {character.shortWhy}
              </p>
            </div>
          </div>
        </div>

        {/* Generative Prompt Snippet */}
        <div className="pt-4 border-t border-purple-950/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-['Cinzel'] uppercase font-bold text-neutral-300">
              Prompt Generativo para {character.name}
            </span>
            <button
              onClick={() => handleCopyPrompt(character.promptGenerative)}
              className="text-xs font-mono text-purple-300 hover:text-purple-100 flex items-center gap-1 cursor-pointer"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar prompt</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3 bg-neutral-950 rounded border border-neutral-800 text-xs font-mono text-purple-200/90 whitespace-pre-wrap">
            {character.promptGenerative}
          </pre>
        </div>
      </div>
    </div>
  );
};
