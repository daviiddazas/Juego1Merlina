import React, { useState } from 'react';
import { QuizResult, CharacterId } from '../types';
import { CHARACTERS } from '../data/nevermoreData';
import { NEVERMORE_ASSETS, CHARACTER_PORTRAITS } from '../assets/imagePaths';
import { downloadNevermoreIdCard } from '../utils/cardCanvas';
import { gothicAudio } from '../utils/audio';
import { copyToClipboard } from '../utils/clipboard';
import { Copy, Check, Download, RefreshCw, Share2, Award, Sparkles } from 'lucide-react';

interface ResultViewProps {
  result: QuizResult;
  onReset: () => void;
  onUpdateName: (name: string) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onReset,
  onUpdateName,
}) => {
  const [copied, setCopied] = useState(false);
  const [studentName, setStudentName] = useState(result.studentName);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);
  const [imgError, setImgError] = useState(false);

  const character = result.topCharacter;
  const portraitUrl = CHARACTER_PORTRAITS[character.id];

  const handleCopyPrompt = async () => {
    await copyToClipboard(character.promptGenerative);
    setCopied(true);
    gothicAudio.playParchment();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNameBlur = () => {
    onUpdateName(studentName);
  };

  const handleDownloadCard = async () => {
    setIsDownloading(true);
    gothicAudio.playSealStamp();
    try {
      await downloadNevermoreIdCard(character, studentName, result.matriculaId);
    } catch {
      // Graceful fallback if canvas export was blocked
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    gothicAudio.playParchment();
    const shareText = `¡He sido clasificado en el Portal de Nunca Más como "${character.name}" (${character.outcastTitle})! 🖤🦇 Descubre tu personaje de Wednesday en el Portal de Nevermore.`;
    if (navigator?.share) {
      try {
        await navigator.share({
          title: 'Mi Credencial de Nevermore Academy',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // user cancelled or share failed, fallback to clipboard
      }
    }
    await copyToClipboard(shareText + ' ' + window.location.href);
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 3000);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Top Banner: Guardian Pronouncement */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-purple-400 font-['Cinzel'] font-bold flex items-center justify-center gap-2">
          <span>🕯️</span>
          <span>Veredicto del Portal de las Sombras</span>
          <span>🕯️</span>
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-neutral-100 font-['Cinzel'] tracking-tight">
          Tu Destino ha sido Revelado
        </h1>
        <p className="text-neutral-400 text-sm md:text-base font-serif italic max-w-xl mx-auto">
          &ldquo;Los cuervos han hablado y las gárgolas han sellado tu inscripción. Tu esencia resuena con la grandeza oscura de Nevermore.&rdquo;
        </p>
      </div>

      {/* Main Official Nevermore ID Card */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-purple-800/80 bg-gradient-to-br from-[#130f1e] via-[#0b0813] to-[#050308] p-6 md:p-8 shadow-[0_0_50px_rgba(75,29,109,0.3)]">
        {/* Subtle decorative corner crosses */}
        <div className="absolute top-3 left-3 text-purple-600/40 text-xs font-mono">✦</div>
        <div className="absolute top-3 right-3 text-purple-600/40 text-xs font-mono">✦</div>
        <div className="absolute bottom-3 left-3 text-purple-600/40 text-xs font-mono">✦</div>
        <div className="absolute bottom-3 right-3 text-purple-600/40 text-xs font-mono">✦</div>

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-purple-900/60 pb-5 mb-6 gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-purple-600/80 p-0.5 bg-neutral-900 shrink-0">
              <img
                src={NEVERMORE_ASSETS.sealStamp}
                alt="Sello de Nevermore"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold tracking-widest text-neutral-100 font-['Cinzel'] uppercase">
                Nevermore Academy
              </h2>
              <p className="text-xs text-purple-400 font-mono tracking-wider">
                TARJETA DE IDENTIFICACIÓN OFICIAL DE EXCLUIDO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {character.isAddamsFamily && (
              <span className="text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-800 px-2.5 py-1 rounded font-mono">
                Linaje Familia Addams
              </span>
            )}
            <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/80 border border-purple-800 px-2.5 py-1 rounded">
              {result.matriculaId}
            </span>
          </div>
        </div>

        {/* Card Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Real Character Photo Portrait */}
          <div className="lg:col-span-5 flex flex-col items-center text-center p-6 rounded-xl bg-[#09070e] border border-purple-900/40 shadow-inner">
            {/* The Photo Frame as requested */}
            <div className="relative mb-4 group">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-purple-600 shadow-[0_0_30px_rgba(147,51,234,0.4)] bg-neutral-950 relative">
                {portraitUrl && !imgError ? (
                  <img
                    src={portraitUrl}
                    alt={`Retrato oficial de ${character.name}`}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-950 to-neutral-950">
                    <span className="text-6xl mb-2">{character.emoji}</span>
                    <span className="text-xs text-purple-300 font-mono">Foto de Nevermore</span>
                  </div>
                )}
                {/* Vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
              </div>

              <span className="absolute -bottom-2 -right-2 bg-neutral-900 border border-purple-600 text-purple-300 text-xs px-2.5 py-0.5 rounded-full font-mono shadow-md">
                100% Match
              </span>
            </div>

            <div className="space-y-1 w-full">
              <span className="text-xs text-neutral-500 uppercase tracking-widest font-['Cinzel']">
                Personaje Asignado
              </span>
              <h3 className="text-2xl font-black text-neutral-100 font-['Cinzel']">
                {character.name}
              </h3>
              <p className="text-xs font-serif italic text-purple-300">
                {character.seriesRole}
              </p>
            </div>

            {/* Custom Student Name Input */}
            <div className="mt-5 pt-4 border-t border-purple-950/60 w-full text-left">
              <label htmlFor="student-name-input" className="block text-xs uppercase font-['Cinzel'] text-neutral-400 mb-1">
                Tu Nombre en el Registro:
              </label>
              <input
                id="student-name-input"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                onBlur={handleNameBlur}
                placeholder="Ingresa tu nombre..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-purple-600 font-serif"
              />
              <span className="text-[11px] text-neutral-500 block mt-1">
                Aparecerá en tu credencial descargable.
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-1 w-full text-xs text-neutral-400 font-mono text-left bg-neutral-950/50 p-3 rounded border border-neutral-900">
              <div>
                <span className="text-neutral-500">Dormitorio:</span>{' '}
                <span className="text-neutral-300">{character.dormitory}</span>
              </div>
              <div>
                <span className="text-neutral-500">Círculo:</span>{' '}
                <span className="text-neutral-300">{character.secretSociety}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Required Output Specs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Required Output 1: Personaje Asignado & Título */}
            <div className="bg-[#0b0813] border border-purple-900/50 rounded-xl p-4.5">
              <div className="flex items-center gap-2 text-xs uppercase font-['Cinzel'] text-purple-400 font-bold mb-1">
                <span>🎓</span>
                <span>Personaje Asignado: {character.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs uppercase font-['Cinzel'] text-purple-300 font-semibold mb-2">
                <span>📜</span>
                <span>Título del Excluido: &ldquo;{character.outcastTitle}&rdquo;</span>
              </div>
            </div>

            {/* Required Output 2: Por qué te pareces a este personaje */}
            <div className="bg-[#0b0813] border border-purple-900/50 rounded-xl p-4.5">
              <div className="flex items-center gap-2 text-xs uppercase font-['Cinzel'] text-purple-400 font-bold mb-2">
                <span>💜</span>
                <span>Por qué te pareces a este personaje</span>
              </div>
              <p className="text-neutral-300 text-sm md:text-base font-serif leading-relaxed italic border-l-2 border-purple-700 pl-3">
                {character.shortWhy}
              </p>
            </div>

            {/* Required Output 3: Frase Emblemática */}
            <div className="bg-[#0b0813] border border-purple-900/50 rounded-xl p-4.5">
              <div className="flex items-center gap-2 text-xs uppercase font-['Cinzel'] text-purple-400 font-bold mb-1.5">
                <span>🕯️</span>
                <span>Frase Emblemática</span>
              </div>
              <p className="text-neutral-200 text-sm md:text-base font-serif italic text-purple-200">
                &ldquo;{character.iconicQuote}&rdquo;
              </p>
            </div>

            {/* Required Output 4: Superpoder / Habilidad En Nevermore */}
            <div className="bg-[#0b0813] border border-purple-900/50 rounded-xl p-4.5">
              <div className="flex items-center gap-2 text-xs uppercase font-['Cinzel'] text-purple-400 font-bold mb-1.5">
                <span>🔮</span>
                <span>Superpoder / Habilidad en Nevermore</span>
              </div>
              <p className="text-neutral-200 text-sm font-semibold">
                {character.superpower}
              </p>
            </div>

            {/* Strengths summary */}
            <div className="flex flex-wrap gap-2 pt-1">
              {character.strengths.map((str, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded bg-purple-950/60 border border-purple-800/60 text-purple-300 font-medium"
                >
                  ✦ {str}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons: Download & Share */}
        <div className="mt-8 pt-6 border-t border-purple-900/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCard}
              disabled={isDownloading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-800 to-purple-950 hover:from-purple-700 hover:to-purple-900 text-white font-medium text-xs md:text-sm rounded-lg border border-purple-500 shadow-[0_0_16px_rgba(147,51,234,0.3)] transition-all cursor-pointer whitespace-nowrap font-['Cinzel']"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generando Credencial...' : 'Descargar Credencial PNG'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-medium text-xs md:text-sm rounded-lg border border-neutral-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir</span>
            </button>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm text-neutral-400 hover:text-purple-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Repetir el Ritual</span>
          </button>
        </div>

        {sharedToast && (
          <div className="mt-3 text-center text-xs text-purple-300 bg-purple-950/90 border border-purple-700 py-1.5 px-3 rounded animate-fade-in">
            ¡Texto del dictamen copiado al portapapeles para compartir con tus amigos!
          </div>
        )}
      </div>

      {/* Required Output Section: Prompt de Imagen Generativo */}
      <div className="bg-[#0b0811] border border-purple-900/60 rounded-xl p-5 md:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🎨</span>
            <h3 className="text-sm md:text-base font-bold text-neutral-100 font-['Cinzel'] uppercase tracking-wider">
              Prompt de Imagen Generativo
            </h3>
            <span className="text-xs text-neutral-500 font-mono hidden sm:inline">
              (Para Midjourney, Imagen 3, DALL-E)
            </span>
          </div>

          <button
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700 rounded transition-colors cursor-pointer self-start sm:self-auto"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Prompt</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-neutral-400">
          Usa este prompt en inglés optimizado para generar tu retrato personalizado al estilo de {character.name}:
        </p>

        {/* Code block as requested */}
        <div className="relative group">
          <pre className="bg-[#050408] border border-neutral-800 rounded-lg p-4 text-xs md:text-sm font-mono text-purple-200/90 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
            <code>{character.promptGenerative}</code>
          </pre>
        </div>
      </div>

      {/* Affinity Breakdown Across Characters */}
      <div className="bg-[#0b0811] border border-neutral-800/80 rounded-xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm md:text-base font-bold text-neutral-100 font-['Cinzel']">
              Afinidad con los Personajes
            </h3>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {Object.keys(result.answers).length} elecciones ponderadas
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(Object.keys(CHARACTERS) as CharacterId[]).map((cId) => {
            const charItem = CHARACTERS[cId];
            const pct = result.affinityScores[cId] || 0;
            const isTop = charItem.id === character.id;
            const thumbUrl = CHARACTER_PORTRAITS[cId];

            return (
              <div
                key={cId}
                className={`p-3 rounded-lg border transition-colors flex flex-col justify-between ${
                  isTop
                    ? 'bg-purple-950/40 border-purple-600/70'
                    : 'bg-neutral-950/60 border-neutral-900 hover:border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-neutral-700 shrink-0 bg-neutral-900">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={charItem.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{charItem.emoji}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-neutral-200 truncate">
                      {charItem.name}
                    </p>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {charItem.isAddamsFamily ? 'Addams' : 'Nevermore'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-300">
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      isTop ? 'bg-purple-500' : 'bg-purple-900/70'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
