import React from 'react';
import { QuizQuestion, QuizOption } from '../types';
import { ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Shuffle } from 'lucide-react';
import { gothicAudio } from '../utils/audio';

interface StepQuizProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelectOption: (option: QuizOption) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  onReshuffle: () => void;
  allAnswered: boolean;
}

export const StepQuiz: React.FC<StepQuizProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  onNext,
  onPrev,
  onSubmit,
  onReshuffle,
  allAnswered,
}) => {
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleOptionClick = (option: QuizOption) => {
    gothicAudio.playParchment();
    // Play light cello pitch
    const pitch = 110.0 + (option.letter?.charCodeAt(0) || 65) * 1.5;
    gothicAudio.playCello(pitch, 0.8);
    onSelectOption(option);
  };

  return (
    <div className="space-y-6">
      {/* Progress & Chapter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-950/60 pb-3">
        <div>
          <span className="text-xs uppercase tracking-widest text-purple-400 font-['Cinzel'] font-semibold">
            Acto Ritual {currentIndex + 1} de {totalQuestions}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 font-['Cinzel'] mt-1">
            {question.title}
          </h2>
        </div>

        {/* Action Controls & Dots */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              gothicAudio.playParchment();
              onReshuffle();
            }}
            title="Revolver el orden de las respuestas"
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-neutral-400 hover:text-purple-300 bg-neutral-900 border border-neutral-800 rounded transition-colors cursor-pointer"
          >
            <Shuffle className="w-3 h-3" />
            <span className="text-[11px]">Revolver</span>
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`h-2 transition-all rounded-full ${
                  i === currentIndex
                    ? 'w-6 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                    : i < currentIndex
                    ? 'w-2 bg-purple-900'
                    : 'w-2 bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scenario Text */}
      <div className="bg-[#0e0a16] border border-purple-900/40 rounded-xl p-4 md:p-5 shadow-inner">
        <p className="text-neutral-200 text-base md:text-lg leading-relaxed font-serif">
          {question.scenario}
        </p>
      </div>

      {/* Shuffled Concise Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {question.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => handleOptionClick(opt)}
              className={`group relative text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-950/80 border-purple-500 shadow-[0_0_18px_rgba(147,51,234,0.35)] ring-1 ring-purple-500/50'
                  : 'bg-[#0d0a14] border-neutral-800/80 hover:border-purple-800/80 hover:bg-[#130e1d]'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Letter Token */}
                <div
                  className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-bold font-['Cinzel'] text-xs transition-colors ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-neutral-900 text-neutral-400 group-hover:text-purple-300 group-hover:bg-purple-950 border border-neutral-800'
                  }`}
                >
                  {opt.letter}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-neutral-200 font-sans font-medium leading-snug">
                    {opt.text}
                  </p>
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-purple-950/50">
        <button
          onClick={() => {
            gothicAudio.playParchment();
            onPrev();
          }}
          disabled={currentIndex === 0}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs md:text-sm font-medium border transition-colors cursor-pointer ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed border-neutral-800 text-neutral-600'
              : 'border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 hover:border-neutral-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        {isLastQuestion ? (
          <button
            onClick={() => {
              gothicAudio.playSealStamp();
              gothicAudio.playBell();
              onSubmit();
            }}
            disabled={!allAnswered}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg cursor-pointer font-['Cinzel'] ${
              allAnswered
                ? 'bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:from-purple-600 hover:to-purple-800 border border-purple-400 shadow-[0_0_24px_rgba(168,85,247,0.4)]'
                : 'opacity-50 cursor-not-allowed bg-neutral-800 text-neutral-500 border border-neutral-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Revelar Mi Destino Excluido</span>
          </button>
        ) : (
          <button
            onClick={() => {
              gothicAudio.playParchment();
              onNext();
            }}
            disabled={!selectedOptionId}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs md:text-sm font-medium border transition-colors cursor-pointer ${
              selectedOptionId
                ? 'bg-purple-950 text-purple-200 border-purple-700 hover:bg-purple-900'
                : 'opacity-40 cursor-not-allowed border-neutral-800 text-neutral-600'
            }`}
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
