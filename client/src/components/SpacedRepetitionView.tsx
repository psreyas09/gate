import React, { useState, useEffect } from 'react';
import {
  Brain,
  RotateCw,
  Sparkles,
  CheckCircle,
  HelpCircle,
  BookMarked,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SpacedRepetitionCard } from '../types';
import { MathText } from './MathText';

interface SpacedRepetitionViewProps {
  onReviewCompleted: () => void;
}

export const SpacedRepetitionView: React.FC<SpacedRepetitionViewProps> = ({ onReviewCompleted }) => {
  const [cards, setCards] = useState<SpacedRepetitionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ratingMessage, setRatingMessage] = useState<string | null>(null);

  const fetchDueCards = () => {
    setLoading(true);
    fetch('/api/reviews/due')
      .then(res => res.json())
      .then((data: SpacedRepetitionCard[]) => {
        setCards(data);
        setCurrentIndex(0);
        setIsFlipped(false);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDueCards();
  }, []);

  const handleRate = async (rating: 1 | 2 | 3 | 4) => {
    if (cards.length === 0 || currentIndex >= cards.length) return;
    const currentCard = cards[currentIndex];

    try {
      const res = await fetch(`/api/reviews/${currentCard.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      const data = await res.json();
      setRatingMessage(data.message);

      setTimeout(() => {
        setRatingMessage(null);
        setIsFlipped(false);
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);

        if (nextIdx >= cards.length) {
          // Completed daily queue! Trigger celebration
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
          onReviewCompleted();
        }
      }, 700);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3">
        <Brain className="w-10 h-10 text-indigo-400 animate-pulse mx-auto" />
        <p className="text-xs text-slate-400">Loading daily spaced repetition queue...</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const isFinished = !currentCard || currentIndex >= cards.length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Brain className="w-3.5 h-3.5" /> SuperMemo SM-2 Engine
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Daily Spaced Repetition Queue</h2>
        <p className="text-xs text-slate-400">
          Reinforce high-yield formulas, theorems, and missed questions before they fade.
        </p>
      </div>

      {!isFinished ? (
        <div className="space-y-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Card {currentIndex + 1} of {cards.length}
            </span>
            <div className="flex items-center gap-3">
              <span>Repetition: {currentCard.repetition}</span>
              <span>EF: {currentCard.ease_factor}</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            />
          </div>

          {/* Flashcard Card Body */}
          <div
            className={`min-h-[260px] sm:min-h-[300px] p-4 sm:p-8 rounded-2xl border transition-all duration-200 flex flex-col justify-between shadow-2xl ${
              isFlipped
                ? 'bg-slate-900 border-indigo-500/40 shadow-indigo-950/30'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Meta Tags */}
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {currentCard.item_type}
                </span>
                {currentCard.subject_name && (
                  <span className="text-xs text-cyan-300 font-semibold truncate max-w-[180px] sm:max-w-none">{currentCard.subject_name}</span>
                )}
              </div>
              {currentCard.is_high_yield === 1 && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
                  ★ High-Yield
                </span>
              )}
            </div>

            {/* Front Prompt */}
            <div className="py-4 sm:py-6">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                Prompt / Concept
              </span>
              <div className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                {currentCard.item_type === 'flashcard' ? (
                  <MathText text={currentCard.flashcard_front || ''} />
                ) : (
                  <MathText text={currentCard.question_text || ''} />
                )}
              </div>
            </div>

            {/* Back (Revealed when flipped) */}
            {isFlipped ? (
              <div className="pt-3 sm:pt-4 border-t border-slate-800 animate-in fade-in space-y-3">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-emerald-400 block">
                  Solution / Explanation
                </span>
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 sm:p-4 rounded-xl border border-slate-800">
                  {currentCard.item_type === 'flashcard' ? (
                    <MathText text={currentCard.flashcard_back || ''} />
                  ) : (
                    <div>
                      <div className="text-xs font-bold text-emerald-400 mb-2">
                        Correct Answer: {currentCard.correct_answer}
                      </div>
                      <MathText text={currentCard.question_explanation || ''} />
                    </div>
                  )}
                </div>

                {currentCard.flashcard_citation && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                    <BookMarked className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Reference: {currentCard.flashcard_citation}</span>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsFlipped(true)}
                className="w-full py-3 sm:py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-750 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors mt-4 min-h-[48px] touch-manipulation"
              >
                <RotateCw className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Show Answer &amp; Explanation</span>
              </button>
            )}
          </div>

          {/* Feedback Rating Notification */}
          {ratingMessage && (
            <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium animate-in fade-in">
              {ratingMessage}
            </div>
          )}

          {/* SM-2 Rating Buttons (Visible only after flipping) */}
          {isFlipped && (
            <div className="space-y-2">
              <span className="text-[11px] text-center block text-slate-400 font-medium">
                Rate your recall difficulty to compute next SM-2 interval:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* 1: Again */}
                <button
                  onClick={() => handleRate(1)}
                  className="p-3 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 active:bg-rose-900 border border-rose-800/80 text-rose-300 text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 shadow-sm min-h-[52px] touch-manipulation active:scale-[0.98]"
                >
                  <span className="text-xs sm:text-sm">Again</span>
                  <span className="text-[10px] font-normal opacity-80">&lt; 1 day</span>
                </button>

                {/* 2: Hard */}
                <button
                  onClick={() => handleRate(2)}
                  className="p-3 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 active:bg-amber-900 border border-amber-800/80 text-amber-300 text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 shadow-sm min-h-[52px] touch-manipulation active:scale-[0.98]"
                >
                  <span className="text-xs sm:text-sm">Hard</span>
                  <span className="text-[10px] font-normal opacity-80">~1–2 days</span>
                </button>

                {/* 3: Good */}
                <button
                  onClick={() => handleRate(3)}
                  className="p-3 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 active:bg-cyan-900 border border-cyan-800/80 text-cyan-300 text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 shadow-sm min-h-[52px] touch-manipulation active:scale-[0.98]"
                >
                  <span className="text-xs sm:text-sm">Good</span>
                  <span className="text-[10px] font-normal opacity-80">~4–6 days</span>
                </button>

                {/* 4: Easy */}
                <button
                  onClick={() => handleRate(4)}
                  className="p-3 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 active:bg-emerald-900 border border-emerald-800/80 text-emerald-300 text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 shadow-sm min-h-[52px] touch-manipulation active:scale-[0.98]"
                >
                  <span className="text-xs sm:text-sm">Easy</span>
                  <span className="text-[10px] font-normal opacity-80">~8+ days</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Finished State */
        <div className="p-8 sm:p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Daily Queue Completed!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            All due cards have been rescheduled according to the SuperMemo SM-2 algorithm. You can do more practice questions or return tomorrow for your next spaced review.
          </p>
          <div className="pt-2">
            <button
              onClick={fetchDueCards}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              Refresh Queue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
