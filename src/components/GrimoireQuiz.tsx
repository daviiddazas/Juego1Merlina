import React, { useState } from 'react';
import { QuizQuestion, QuizOption } from '../types';
import { Sparkles, Terminal, CheckCircle2, Shuffle } from 'lucide-react';
import { gothicAudio } from '../utils/audio';

interface GrimoireQuizProps {
  questions: QuizQuestion[];
  answers: Record<number, string>; // questionId -> optionId
  onSelectOption: (questionId: number, option: QuizOption) => void;
  onApplyBatchAnswers: (parsed: Record<number, string>) => void;
  onReshuffle: () => void;
  onSubmit: () => void;
}

export const GrimoireQuiz: React.FC<GrimoireQuizProps> = ({
  questions,
  answers,
  onSelectOption,
  onApplyBatchAnswers,
  onReshuffle,
  onSubmit,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === questions.length;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParseError(null);
    if (!quickInput.trim()) return;

    // Pattern matching letter inputs like 1A, 2C or A, B, C...
    const cleaned = quickInput.toUpperCase();
    const newAnswers: Record<number, string> = {};

    const numberedMatches = cleaned.match(/([1-5])\s*[:=\-]?\s*([A-J])/g);
    if (numberedMatches && numberedMatches.length > 0) {
      numberedMatches.forEach((m) => {
        const qNum = parseInt(m.match(/[1-5]/)?.[0] || '0', 10);
        const letter = m.match(/[A-J]/)?.[0];
        const qObj = questions.find((q) => q.id === qNum);
        if (qObj && letter) {
          const matchedOpt = qObj.options.find((opt) => opt.letter === letter);
          if (matchedOpt) {
            newAnswers[qNum] = matchedOpt.id;
          }
        }
      });
    } else {
      const letters = cleaned.match(/[A-J]/g);
      if (letters && letters.length > 0) {
        letters.slice(0, 5).forEach((letter, idx) => {
          const qObj = questions[idx];
          if (qObj) {
            const matchedOpt = qObj.options.find((opt) => opt.letter === letter);
            if (matchedOpt) {
              newAnswers[qObj.id] = matchedOpt.id;
            }
          }
        });
      }
    }

    if (Object.keys(newAnswers).length === 0) {
      setParseError('No pudimos descifrar tus letras. Introduce por ejemplo "1A, 2C, 3B, 4D, 5E".');
      return;
    }

    gothicAudio.playParchment();
    onApplyBatchAnswers(newAnswers);
  };

  return (
    <div className="space-y-8">
      {/* Quick Input Bar (Grimoire Terminal) */}
      <div className="bg-[#100c18] border border-purple-900/50 rounded-xl p-4 md:p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span className="text-xs uppercase font-['Cinzel'] tracking-wider text-purple-300 font-semibold">
              Inscripción Rápida del Excluido
            </span>
          </div>

          <button
            onClick={() => {
              gothicAudio.playParchment();
              onReshuffle();
            }}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-purple-300 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 transition-colors cursor-pointer"
          >
            <Shuffle className="w-3 h-3" />
            <span>Revolver Opciones</span>
          </button>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Ejemplo: 1A, 2C, 3B, 4D, 5E o A C B D E"
            className="flex-1 bg-neutral-950/80 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Aplicar al Grimorio
          </button>
        </form>

        {parseError && (
          <p className="mt-2 text-xs text-rose-400 font-sans">{parseError}</p>
        )}
      </div>

      {/* The 5 Questions List */}
      <div className="space-y-6">
        {questions.map((q) => {
          const selectedOptId = answers[q.id];
          const selectedOpt = q.options.find((opt) => opt.id === selectedOptId);

          return (
            <div
              key={q.id}
              className="bg-[#0b0811] border border-neutral-800/80 rounded-xl p-5 transition-colors hover:border-purple-950"
            >
              <div className="flex items-center justify-between gap-3 border-b border-purple-950/40 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-400 font-['Cinzel'] uppercase">
                    Cuestión {q.id}.
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-neutral-100 font-['Cinzel']">
                    {q.title}
                  </h3>
                </div>
                {selectedOpt && (
                  <span className="text-xs font-mono text-purple-300 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded">
                    Opción {selectedOpt.letter}
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-300 font-serif leading-relaxed mb-3">
                {q.scenario}
              </p>

              {/* Shuffled Concise Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {q.options.map((opt) => {
                  const isOptSelected = selectedOptId === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        gothicAudio.playParchment();
                        onSelectOption(q.id, opt);
                      }}
                      className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2.5 ${
                        isOptSelected
                          ? 'bg-purple-950/80 border-purple-500 shadow-[0_0_14px_rgba(147,51,234,0.3)] ring-1 ring-purple-500/40'
                          : 'bg-neutral-950/60 border-neutral-800/70 hover:border-purple-900 hover:bg-[#120d1c]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 shrink-0 rounded flex items-center justify-center font-bold text-xs font-['Cinzel'] ${
                          isOptSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                        }`}
                      >
                        {opt.letter}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-200 font-medium leading-snug">
                          {opt.text}
                        </p>
                      </div>

                      {isOptSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Evaluation Bar */}
      <div className="sticky bottom-4 z-30 p-4 rounded-xl bg-[#0d0914]/95 backdrop-blur-md border border-purple-900/60 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-neutral-300">
          <span className="font-semibold text-purple-300">
            {answeredCount} de {questions.length} cuestiones
          </span>{' '}
          selladas en el grimorio.
        </div>

        <button
          onClick={() => {
            gothicAudio.playSealStamp();
            gothicAudio.playBell();
            onSubmit();
          }}
          disabled={!isComplete}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer font-['Cinzel'] ${
            isComplete
              ? 'bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:from-purple-600 hover:to-purple-800 border border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
              : 'opacity-50 cursor-not-allowed bg-neutral-800 text-neutral-500 border border-neutral-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span>Evaluar Destino en Nunca Más</span>
        </button>
      </div>
    </div>
  );
};
