/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { GuardianBanner } from './components/GuardianBanner';
import { StepQuiz } from './components/StepQuiz';
import { GrimoireQuiz } from './components/GrimoireQuiz';
import { ResultView } from './components/ResultView';
import { OpheliaWindowSection } from './components/OpheliaWindowSection';
import { CharacterRoster } from './components/CharacterRoster';
import {
  CHARACTERS,
  GUARDIAN_WELCOME_QUOTES,
  generateShuffledQuestions,
} from './data/nevermoreData';
import { QuizOption, QuizResult, CharacterId, QuizQuestion } from './types';
import { NEVERMORE_ASSETS } from './assets/imagePaths';

export default function App() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'window' | 'roster'>('quiz');
  const [quizMode, setQuizMode] = useState<'step' | 'scroll'>('step');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => generateShuffledQuestions());
  const [answers, setAnswers] = useState<Record<number, string>>({}); // questionId -> optionId
  const [result, setResult] = useState<QuizResult | null>(null);
  const [studentName, setStudentName] = useState('Estudiante Excluido');
  const [matriculaId, setMatriculaId] = useState(() => `NVM-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [guardianMessage, setGuardianMessage] = useState(
    'Bienvenido seas, mortal o excluido. La Familia Addams y los marginados de Nunca Más aguardan para juzgar tu alma.'
  );

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentStepIndex];

  // Handler for reshuffling options
  const handleReshuffle = () => {
    setQuestions(generateShuffledQuestions());
    setAnswers({});
    setGuardianMessage('Las sombras han barajado las cartas del destino. Ninguna respuesta permanece en su sitio anterior.');
  };

  // Handler for option selection
  const handleSelectOption = (questionId: number, option: QuizOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option.id,
    }));
    setGuardianMessage(option.guardianComment);
  };

  // Step mode next/prev
  const handleNextStep = () => {
    if (currentStepIndex < totalQuestions - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Quick batch apply
  const handleApplyBatchAnswers = (newAnswers: Record<number, string>) => {
    setAnswers((prev) => ({
      ...prev,
      ...newAnswers,
    }));
    setGuardianMessage('Has marcado tus elecciones en el grimorio con rapidez gélida. Procede a sellar tu destino.');
  };

  // Calculate Result across all 10 characters (Addams family + Nevermore)
  const handleEvaluateQuiz = () => {
    const counts: Record<CharacterId, number> = {
      wednesday: 0,
      morticia: 0,
      gomez: 0,
      fester: 0,
      pugsley: 0,
      dedos: 0,
      enid: 0,
      xavier: 0,
      bianca: 0,
      eugene: 0,
    };

    // Tally characterIds from selected optionIds
    Object.entries(answers).forEach(([qIdStr, optId]) => {
      const qId = parseInt(qIdStr, 10);
      const question = questions.find((q) => q.id === qId);
      if (question) {
        const selectedOpt = question.options.find((opt) => opt.id === optId);
        if (selectedOpt && counts[selectedOpt.characterId] !== undefined) {
          counts[selectedOpt.characterId] += 1;
        }
      }
    });

    // Find top character with highest score
    let topCharId: CharacterId = 'wednesday';
    let maxCount = -1;

    (Object.keys(counts) as CharacterId[]).forEach((charId) => {
      if (counts[charId] > maxCount) {
        maxCount = counts[charId];
        topCharId = charId;
      }
    });

    // Calculate percentage affinities
    const totalAnswered = Math.max(Object.keys(answers).length, 1);
    const affinities: Record<CharacterId, number> = {} as Record<CharacterId, number>;
    (Object.keys(counts) as CharacterId[]).forEach((charId) => {
      affinities[charId] = Math.round(((counts[charId] || 0) / totalAnswered) * 100);
    });

    const finalResult: QuizResult = {
      topCharacter: CHARACTERS[topCharId],
      affinityScores: affinities,
      answers,
      studentName,
      matriculaId,
      completedAt: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    setResult(finalResult);
    setActiveTab('quiz');
    setGuardianMessage(`¡El espejo ha revelado tu reflejo! Resuenas con el alma de ${CHARACTERS[topCharId].name}.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setCurrentStepIndex(0);
    setResult(null);
    setQuestions(generateShuffledQuestions());
    const randomQuote = GUARDIAN_WELCOME_QUOTES[Math.floor(Math.random() * GUARDIAN_WELCOME_QUOTES.length)];
    setGuardianMessage(randomQuote);
  };

  const allAnswered = totalQuestions > 0 && Object.keys(answers).length === totalQuestions;

  return (
    <div className="min-h-screen bg-[#07060a] text-neutral-200 flex flex-col font-sans selection:bg-purple-900 selection:text-purple-100">
      {/* Top Header */}
      <Header
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        onResetQuiz={handleResetQuiz}
        hasResult={result !== null}
      />

      {/* Hero Atmosphere Section */}
      <section className="relative overflow-hidden border-b border-purple-950/60 bg-[#0a0812]">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={NEVERMORE_ASSETS.gateBanner}
            alt="Portón de Nevermore Academy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07060a] via-[#07060a]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-mono uppercase tracking-widest">
            <span>🦇</span>
            <span>Test de Personalidad · Wednesday & Los Addams</span>
            <span>🦇</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-neutral-100 font-['Cinzel'] tracking-tight">
            ¿Quién Eres en Nevermore?
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-serif leading-relaxed">
            Descubre si tu alma pertenece a la misteriosa <strong className="text-amber-200">Familia Addams</strong> (Wednesday, Morticia, Gomez, Lucas, Pericles, Dedos) o a los legendarios <strong className="text-purple-300">Excluidos de Nevermore</strong> (Enid, Xavier, Bianca, Eugene).
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Guardian Master Banner */}
        <GuardianBanner
          currentMessage={guardianMessage}
          quizMode={quizMode}
          onToggleMode={setQuizMode}
          isCompleted={result !== null}
        />

        {/* Tab 1: Quiz or Result */}
        {activeTab === 'quiz' && (
          <div>
            {result ? (
              <ResultView
                result={result}
                onReset={handleResetQuiz}
                onUpdateName={setStudentName}
              />
            ) : currentQuestion ? (
              quizMode === 'step' ? (
                <StepQuiz
                  question={currentQuestion}
                  currentIndex={currentStepIndex}
                  totalQuestions={totalQuestions}
                  selectedOptionId={answers[currentQuestion.id]}
                  onSelectOption={(opt) => handleSelectOption(currentQuestion.id, opt)}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                  onSubmit={handleEvaluateQuiz}
                  onReshuffle={handleReshuffle}
                  allAnswered={allAnswered}
                />
              ) : (
                <GrimoireQuiz
                  questions={questions}
                  answers={answers}
                  onSelectOption={handleSelectOption}
                  onApplyBatchAnswers={handleApplyBatchAnswers}
                  onReshuffle={handleReshuffle}
                  onSubmit={handleEvaluateQuiz}
                />
              )
            ) : null}
          </div>
        )}

        {/* Tab 2: Ophelia Window */}
        {activeTab === 'window' && <OpheliaWindowSection />}

        {/* Tab 3: Character Dossier Roster */}
        {activeTab === 'roster' && <CharacterRoster />}
      </main>

      {/* Gothic Footer */}
      <footer className="mt-auto border-t border-purple-950/70 bg-[#060509] py-8 px-4 text-center text-xs text-neutral-500 font-mono space-y-2">
        <p className="font-['Cinzel'] tracking-widest text-neutral-400">
          NEVERMORE ACADEMY & THE ADDAMS FAMILY · SANCTUARIUM EXCLUSORUM
        </p>
        <p className="text-[11px] text-neutral-600">
          Inspirado en el universo de Wednesday (Netflix). Todas las marcas y personajes pertenecen a sus respectivos creadores.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2 text-neutral-600 text-[11px]">
          <span>Dirección Larissa Weems</span>
          <span>·</span>
          <span>Jericho, Vermont</span>
          <span>·</span>
          <span>Guardián del Portal Sombrío</span>
        </div>
      </footer>
    </div>
  );
}
