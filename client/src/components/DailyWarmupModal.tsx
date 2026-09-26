import React, { useState, useEffect } from 'react';
import {
  Flame,
  X,
  Timer,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Award,
  Sparkles,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question } from '../types';
import { MathText } from './MathText';

interface DailyWarmupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

export const DailyWarmupModal: React.FC<DailyWarmupModalProps> = ({
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuestions([]);
      setAnswers({});
      setResults(null);
      setIsFinished(false);
      return;
    }

    // Load 5 curated questions (Aptitude, Math, and Core CS)
    setLoading(true);
    fetch('/api/questions?interleaving=true&is_high_yield=1')
      .then(res => res.json())
      .then((data: Question[]) => {
        // Pick 5 varied questions
        const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 5);
        setQuestions(shuffled);
        setCurrentIndex(0);
        setTimeLeft(300);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || isFinished || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isFinished, timeLeft]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (q: Question, char: string) => {
    if (q.type === 'MCQ') {
      setAnswers(prev => ({ ...prev, [q.id]: char }));
    } else if (q.type === 'MSQ') {
      const cur = answers[q.id] || [];
      const updated = cur.includes(char) ? cur.filter((x: string) => x !== char) : [...cur, char].sort();
      setAnswers(prev => ({ ...prev, [q.id]: updated }));
    }
  };

  const handleNatInput = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async () => {
    setIsFinished(true);
    setLoading(true);

    const evaluatedResults: any[] = [];
    for (const q of questions) {
      const userAns = answers[q.id];
      try {
        const res = await fetch(`/api/questions/${q.id}/attempt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAnswer: userAns !== undefined ? userAns : '',
            timeSpentSecs: 30,
            mode: 'daily_warmup'
          })
        });
        const data = await res.json();
        evaluatedResults.push({
          question: q,
          userAnswer: userAns,
          ...data
        });
      } catch (err) {
        evaluatedResults.push({
          question: q,
          userAnswer: userAns,
          isCorrect: false,
          explanation: q.explanation,
          correctAnswer: q.correct_answer
        });
      }
    }

    setResults(evaluatedResults);
    setLoading(false);

    const correctCount = evaluatedResults.filter(r => r.isCorrect).length;
    if (correctCount >= 3) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }

    if (onCompleted) onCompleted();
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const userAns = currentQ ? answers[currentQ.id] : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Daily 5 Rapid Fire</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Micro-Drill
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                5 High-yield questions to maintain your study momentum
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isFinished && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 font-bold">
                <Timer className="w-3.5 h-3.5 text-cyan-400" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs">Preparing your daily questions...</p>
            </div>
          )}

          {/* Active Questions Mode */}
          {!loading && !isFinished && currentQ && (
            <div className="space-y-4">
              {/* Question Progress Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span>
                  Question <strong className="text-white">{currentIndex + 1}</strong> of {questions.length}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                  {currentQ.subject_name} • {currentQ.type}
                </span>
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base text-slate-100 leading-relaxed">
                <MathText text={currentQ.question_text} />
              </div>

              {/* Options or NAT */}
              {currentQ.type === 'NAT' ? (
                <div className="space-y-2 pt-2">
                  <span className="text-xs text-slate-400">Enter numerical value:</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={userAns || ''}
                    onChange={e => handleNatInput(currentQ.id, e.target.value)}
                    placeholder="e.g. 4.5"
                    className="w-full sm:w-48 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  {currentQ.options?.map((opt, idx) => {
                    const char = String.fromCharCode(65 + idx);
                    const isSelected =
                      currentQ.type === 'MCQ'
                        ? userAns === char
                        : Array.isArray(userAns) && userAns.includes(char);

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(currentQ, char)}
                        className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="font-bold opacity-75 shrink-0">{char}.</span>
                        <span className="flex-1 leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Results Summary Mode */}
          {!loading && isFinished && results && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Score banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <div className="text-3xl font-extrabold text-white">
                  {results.filter(r => r.isCorrect).length} / {results.length} Correct
                </div>
                <p className="text-xs text-slate-400">
                  {results.filter(r => r.isCorrect).length >= 3
                    ? '🎉 Great job! Consistent daily practice is the key to qualifying.'
                    : '⚡ Missed questions have been automatically added to your Spaced Repetition queue for review.'}
                </p>
              </div>

              {/* Review questions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Review &amp; Solutions
                </h4>
                {results.map((r, idx) => (
                  <div
                    key={r.question.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400">Q{idx + 1}. {r.question.subject_name}</span>
                      {r.isCorrect ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>
                    <p className="text-slate-200 line-clamp-2">{r.question.question_text}</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <div>Your: <strong className="text-white">{String(r.userAnswer || 'Skipped')}</strong></div>
                      <div>Correct: <strong className="text-emerald-400">{String(r.correctAnswer)}</strong></div>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 text-slate-300 text-[11px]">
                      <span className="font-semibold text-cyan-400 block mb-0.5">Solution:</span>
                      <MathText text={r.explanation} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          {!isFinished ? (
            <>
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-900/40"
                >
                  Submit Challenge
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Close Daily Challenge
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
