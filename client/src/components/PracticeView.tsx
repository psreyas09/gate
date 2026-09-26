import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Filter,
  Shuffle,
  Calendar,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookMarked,
  Calculator,
  Star,
} from 'lucide-react';
import { Question, Subject, Topic, Tier } from '../types';
import { MathText } from './MathText';
import { GateCalculator } from './GateCalculator';

interface PracticeViewProps {
  initialSubjectId?: string;
  drillWeakOnly?: boolean;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ drillWeakOnly = false }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [pyqOnly, setPyqOnly] = useState<boolean>(false);
  const [highYieldOnly, setHighYieldOnly] = useState<boolean>(false);
  const [interleaving, setInterleaving] = useState<boolean>(false);
  const [starredOnly, setStarredOnly] = useState<boolean>(false);
  const [isCalcOpen, setIsCalcOpen] = useState<boolean>(false);
  const [activeCalcQId, setActiveCalcQId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [starredQuestions, setStarredQuestions] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('gate_bookmarked_questions') || '[]');
    } catch {
      return [];
    }
  });

  const toggleStarQuestion = (qId: string) => {
    setStarredQuestions(prev => {
      const updated = prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId];
      localStorage.setItem('gate_bookmarked_questions', JSON.stringify(updated));
      return updated;
    });
  };

  // Attempt state per question: { [qId]: { userAnswer, isSubmitted, result, timeSpent } }
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [attemptResults, setAttemptResults] = useState<Record<string, any>>({});

  useEffect(() => {
    fetch('/api/subjects')
      .then(res => res.json())
      .then((data: Subject[]) => setSubjects(data))
      .catch(console.error);
  }, []);

  const loadQuestions = () => {
    setLoading(true);
    let url = '/api/questions?';
    if (drillWeakOnly) {
      url = '/api/weak-areas/drill';
    } else {
      const params = new URLSearchParams();
      if (selectedSubject) params.set('subject_id', selectedSubject);
      if (selectedTier) params.set('tier', selectedTier);
      if (selectedType) params.set('type', selectedType);
      if (pyqOnly) params.set('is_pyq', '1');
      if (highYieldOnly) params.set('is_high_yield', '1');
      if (interleaving) params.set('interleaving', 'true');
      url += params.toString();
    }

    fetch(url)
      .then(res => res.json())
      .then((data: Question[]) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedSubject, selectedTier, selectedType, pyqOnly, highYieldOnly, interleaving, drillWeakOnly]);

  const handleSelectOption = (q: Question, optionChar: string) => {
    if (attemptResults[q.id]) return; // already submitted

    if (q.type === 'MCQ') {
      setUserAnswers(prev => ({ ...prev, [q.id]: optionChar }));
    } else if (q.type === 'MSQ') {
      const current = userAnswers[q.id] || [];
      const updated = current.includes(optionChar)
        ? current.filter((item: string) => item !== optionChar)
        : [...current, optionChar].sort();
      setUserAnswers(prev => ({ ...prev, [q.id]: updated }));
    }
  };

  const handleNatInput = (qId: string, val: string) => {
    if (attemptResults[qId]) return;
    setUserAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmitAttempt = async (q: Question) => {
    const answer = userAnswers[q.id];
    if (answer === undefined || answer === '') return;

    try {
      const res = await fetch(`/api/questions/${q.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAnswer: answer,
          timeSpentSecs: 45,
          mode: drillWeakOnly ? 'weak_drill' : pyqOnly ? 'pyq' : 'practice'
        }),
      });
      const data = await res.json();
      setAttemptResults(prev => ({ ...prev, [q.id]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Filter Controls */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 sm:space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Practice &amp; PYQ Question Bank</h2>
              {drillWeakOnly && (
                <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Weak-Area Drill
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Immediate feedback with full reasoning. Missed questions automatically schedule for SM-2 review.
            </p>
          </div>

          {/* Interleaving Switch */}
          <button
            onClick={() => setInterleaving(!interleaving)}
            className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all touch-manipulation min-h-[40px] shrink-0 ${
              interleaving
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Interleaving Mode {interleaving ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="w-full sm:w-auto bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 min-h-[38px]"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                Tier {s.tier}: {s.name}
              </option>
            ))}
          </select>

          {/* Tier Filter */}
          <select
            value={selectedTier}
            onChange={e => setSelectedTier(e.target.value)}
            className="w-full sm:w-auto bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 min-h-[38px]"
          >
            <option value="">All Tiers</option>
            <option value="1">Tier 1 (Full Depth)</option>
            <option value="2">Tier 2 (Fundamentals)</option>
            <option value="3">Tier 3 (Light Touch)</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="w-full sm:w-auto bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 min-h-[38px]"
          >
            <option value="">All Types (MCQ, MSQ, NAT)</option>
            <option value="MCQ">MCQ (Multiple Choice)</option>
            <option value="MSQ">MSQ (Multiple Select)</option>
            <option value="NAT">NAT (Numerical Answer)</option>
          </select>

          {/* PYQ Only Toggle */}
          <button
            onClick={() => setPyqOnly(!pyqOnly)}
            className={`w-full sm:w-auto px-3.5 py-2 rounded-lg border font-medium transition-all min-h-[38px] flex items-center justify-center ${
              pyqOnly
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-semibold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            GATE PYQs Only
          </button>

          {/* High-Yield Qualify Only Toggle */}
          <button
            onClick={() => setHighYieldOnly(!highYieldOnly)}
            className={`w-full sm:w-auto px-3.5 py-2 rounded-lg border font-medium transition-all min-h-[38px] flex items-center justify-center ${
              highYieldOnly
                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-semibold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            🎯 High-Yield Only
          </button>

          {/* Starred Only Toggle */}
          <button
            onClick={() => setStarredOnly(!starredOnly)}
            className={`w-full sm:w-auto px-3.5 py-2 rounded-lg border font-medium transition-all min-h-[38px] flex items-center justify-center gap-1.5 ${
              starredOnly
                ? 'bg-amber-600/30 border-amber-500 text-amber-200 font-semibold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${starredOnly ? 'fill-current' : ''}`} />
            <span>Starred ({starredQuestions.length})</span>
          </button>

          {/* Calculator Toggle */}
          <button
            onClick={() => setIsCalcOpen(!isCalcOpen)}
            className={`w-full sm:w-auto px-3.5 py-2 rounded-lg border font-medium transition-all min-h-[38px] flex items-center justify-center gap-1.5 ${
              isCalcOpen
                ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200 font-semibold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span>Virtual Calc</span>
          </button>
        </div>
      </div>

      {/* Question List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading questions...</div>
      ) : questions.filter(q => !starredOnly || starredQuestions.includes(q.id)).length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm">No questions match the current filters.</p>
          <button
            onClick={() => {
              setSelectedSubject('');
              setSelectedTier('');
              setSelectedType('');
              setPyqOnly(false);
              setStarredOnly(false);
            }}
            className="text-xs text-cyan-400 underline p-1"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {questions
            .filter(q => !starredOnly || starredQuestions.includes(q.id))
            .map((q, idx) => {
            const userAnswer = userAnswers[q.id];
            const result = attemptResults[q.id];
            const isSubmitted = Boolean(result);

            return (
              <div
                key={q.id}
                className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 sm:space-y-4 shadow-lg hover:border-slate-700/80 transition-all"
              >
                {/* Meta header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                      Q{idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      {q.type} • {q.marks} Mark{q.marks > 1 ? 's' : ''}
                    </span>
                    {q.is_pyq === 1 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        GATE {q.pyq_year} {q.pyq_session || ''}
                      </span>
                    )}
                    {q.is_high_yield === 1 && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        ★ High-Yield
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs text-slate-400">
                      {q.subject_name} • <span className="text-slate-300">{q.topic_name}</span>
                    </span>
                    <button
                      onClick={() => toggleStarQuestion(q.id)}
                      className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                        starredQuestions.includes(q.id) ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={starredQuestions.includes(q.id) ? 'Remove Star' : 'Star Question'}
                    >
                      <Star className={`w-3.5 h-3.5 ${starredQuestions.includes(q.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-slate-100 text-sm sm:text-base font-normal leading-relaxed">
                  <MathText text={q.question_text} />
                </div>

                {/* Input / Options area */}
                {q.type === 'NAT' ? (
                  /* Numerical Answer Type Input */
                  <div className="space-y-2 pt-2">
                    <span className="text-xs text-slate-400 block">Enter numerical value:</span>
                    <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5">
                      <input
                        type="text"
                        inputMode="decimal"
                        disabled={isSubmitted}
                        value={userAnswer || ''}
                        onChange={e => handleNatInput(q.id, e.target.value)}
                        placeholder="e.g. 98 or 2.5"
                        className="w-full xs:w-48 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-70 min-h-[44px]"
                      />
                      {!isSubmitted && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCalcQId(q.id);
                            setIsCalcOpen(true);
                          }}
                          className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors self-start xs:self-auto"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          <span>Calc</span>
                        </button>
                      )}
                      {!isSubmitted && (
                        <button
                          onClick={() => handleSubmitAttempt(q)}
                          disabled={!userAnswer}
                          className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors min-h-[44px]"
                        >
                          Submit Answer
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* MCQ or MSQ Options */
                  <div className="space-y-2 pt-2">
                    {q.type === 'MSQ' && (
                      <span className="text-[11px] text-cyan-400 font-semibold block">
                        (Multiple Select Question: Select one or more correct options)
                      </span>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options?.map((opt, oIdx) => {
                        const char = String.fromCharCode(65 + oIdx);
                        const isSelected =
                          q.type === 'MCQ'
                            ? userAnswer === char
                            : Array.isArray(userAnswer) && userAnswer.includes(char);

                        let btnClass = 'bg-slate-950/60 border-slate-800 hover:border-slate-600 text-slate-300';

                        if (isSubmitted) {
                          const isActuallyCorrect =
                            q.type === 'MCQ'
                              ? q.correct_answer === char
                              : JSON.parse(q.correct_answer).includes(char);

                          if (isActuallyCorrect) {
                            btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                          } else if (isSelected && !isActuallyCorrect) {
                            btnClass = 'bg-rose-500/20 border-rose-500 text-rose-300 line-through';
                          }
                        } else if (isSelected) {
                          btnClass = 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-medium';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(q, char)}
                            disabled={isSubmitted}
                            className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-2.5 min-h-[46px] touch-manipulation active:scale-[0.99] ${btnClass}`}
                          >
                            <span className="font-bold opacity-75 shrink-0">{char}.</span>
                            <span className="flex-1 leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {!isSubmitted && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleSubmitAttempt(q)}
                          disabled={!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors min-h-[44px]"
                        >
                          Check Answer
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Immediate Explanation Box */}
                {isSubmitted && (
                  <div
                    className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in ${
                      result.isCorrect
                        ? 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
                        : 'bg-rose-950/30 border-rose-800 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-2">
                        {result.isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Correct! (+{q.marks} Marks in GATE)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-400" />
                            <span>
                              Incorrect. Correct Answer: <strong className="underline">{q.correct_answer}</strong>
                            </span>
                          </>
                        )}
                      </div>
                      {!result.isCorrect && (
                        <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          Added to SM-2 Review Queue
                        </span>
                      )}
                    </div>
                    <div className="pt-1 text-slate-300">
                      <span className="font-semibold text-slate-200 block mb-1">Reasoning &amp; Concept:</span>
                      <MathText text={result.explanation} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating GATE Virtual Scientific Calculator */}
      <GateCalculator
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        onInsertValue={(val) => {
          if (activeCalcQId) {
            handleNatInput(activeCalcQId, val);
          }
        }}
      />
    </div>
  );
};
