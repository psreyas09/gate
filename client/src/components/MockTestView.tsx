import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  BarChart2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, MockSession } from '../types';
import { MathText } from './MathText';

interface MockTestViewProps {
  onMockCompleted: () => void;
}

export const MockTestView: React.FC<MockTestViewProps> = ({ onMockCompleted }) => {
  const [testState, setTestState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [sessionData, setSessionData] = useState<{
    sessionId: string;
    title: string;
    totalMarks: number;
    durationMinutes: number;
    questions: Question[];
  } | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  // Answers map: { [qId]: { userAnswer: any, timeSpent: number } }
  const [mockAnswers, setMockAnswers] = useState<Record<string, any>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [mockResult, setMockResult] = useState<any>(null);
  const [mockHistory, setMockHistory] = useState<MockSession[]>([]);

  useEffect(() => {
    fetch('/api/mock/history')
      .then(res => res.json())
      .then(data => setMockHistory(data))
      .catch(console.error);
  }, [testState]);

  // Countdown timer
  useEffect(() => {
    if (testState !== 'running' || timeLeftSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [testState, timeLeftSeconds]);

  const handleStartMock = async (questionCount = 10, durationMinutes = 30) => {
    try {
      const res = await fetch('/api/mock/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionCount, durationMinutes, title: 'GATE CSE Qualifying Mock Test' }),
      });
      const data = await res.json();
      setSessionData(data);
      setTimeLeftSeconds(durationMinutes * 60);
      setCurrentQuestionIndex(0);
      setMockAnswers({});
      setMarkedForReview({});
      setTestState('running');
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionSelect = (q: Question, char: string) => {
    if (q.type === 'MCQ') {
      setMockAnswers(prev => ({
        ...prev,
        [q.id]: { userAnswer: char, timeSpent: (prev[q.id]?.timeSpent || 0) + 5 }
      }));
    } else if (q.type === 'MSQ') {
      const current = prevUserAnswer(q.id) || [];
      const updated = current.includes(char)
        ? current.filter((item: string) => item !== char)
        : [...current, char].sort();
      setMockAnswers(prev => ({
        ...prev,
        [q.id]: { userAnswer: updated, timeSpent: (prev[q.id]?.timeSpent || 0) + 5 }
      }));
    }
  };

  const handleNatInput = (qId: string, val: string) => {
    setMockAnswers(prev => ({
      ...prev,
      [qId]: { userAnswer: val, timeSpent: (prev[qId]?.timeSpent || 0) + 5 }
    }));
  };

  const prevUserAnswer = (qId: string) => {
    return mockAnswers[qId]?.userAnswer;
  };

  const handleSubmitTest = async () => {
    if (!sessionData) return;
    const totalTimeSpent = sessionData.durationMinutes * 60 - timeLeftSeconds;

    try {
      const res = await fetch(`/api/mock/${sessionData.sessionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: mockAnswers,
          timeSpentSeconds: totalTimeSpent,
          title: sessionData.title,
        }),
      });
      const data = await res.json();
      setMockResult(data);
      setTestState('completed');

      if (data.passedCutoff) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      onMockCompleted();
    } catch (err) {
      console.error(err);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (testState === 'idle') {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
            <Timer className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">GATE CSE Timed Benchmark Simulation</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Test yourself under strict GATE examination rules with genuine negative marking:
            <span className="text-rose-400 block font-medium mt-1">
              -1/3 penalty for 1-mark MCQs, -2/3 for 2-mark MCQs (0 penalty for MSQ and NAT).
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={() => handleStartMock(10, 25)}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-900/40 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Mini-Mock (10 Questions • 25 Mins)</span>
            </button>
            <button
              onClick={() => handleStartMock(25, 60)}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-900/40 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Standard Mock (25 Questions • 60 Mins)</span>
            </button>
          </div>
        </div>

        {/* Previous Mock Test History */}
        {mockHistory.length > 0 && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Past Mock Test Results
            </h3>
            <div className="divide-y divide-slate-800">
              {mockHistory.map(m => (
                <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">{m.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(m.created_at).toLocaleDateString()} • {Math.round(m.duration_seconds / 60)} mins
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="font-mono text-sm font-bold text-white">
                        {m.score_obtained} / {m.total_marks}
                      </div>
                      <div className="text-[10px] text-slate-400">Cutoff: {m.target_cutoff}</div>
                    </div>
                    {m.passed_cutoff === 1 ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Qualified ✓
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Below Cutoff
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const [showPaletteMobile, setShowPaletteMobile] = useState(false);

  // Active Running Mock
  if (testState === 'running' && sessionData) {
    const currentQ = sessionData.questions[currentQuestionIndex];
    const userAns = prevUserAnswer(currentQ.id);

    return (
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Top Floating Bar */}
        <div className="p-3 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-lg gap-2">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-200 truncate max-w-[160px] xs:max-w-xs sm:max-w-none">{sessionData.title}</h2>
            <span className="text-[11px] sm:text-xs text-slate-400">
              Q{currentQuestionIndex + 1} of {sessionData.questions.length}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs sm:text-sm font-bold text-cyan-400">
              <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>
            <button
              onClick={handleSubmitTest}
              className="px-3 sm:px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors min-h-[36px]"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Mobile Toggle for Palette */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowPaletteMobile(!showPaletteMobile)}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 flex items-center justify-between"
          >
            <span>Question Palette ({currentQuestionIndex + 1} / {sessionData.questions.length})</span>
            <span className="text-cyan-400 font-bold">{showPaletteMobile ? '▲ Hide' : '▼ View Palette'}</span>
          </button>
        </div>

        {/* Main Grid: Question View + Question Palette */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Question area (8 cols) */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 sm:space-y-5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    {currentQ.type} • {currentQ.marks} Mark{currentQ.marks > 1 ? 's' : ''}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-400">{currentQ.subject_name}</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-rose-400 font-medium">
                  {currentQ.type === 'MCQ'
                    ? `Penalty: -${currentQ.marks === 1 ? '0.33' : '0.67'}`
                    : 'No Negative Marking'}
                </div>
              </div>

              {/* Question text */}
              <div className="text-sm sm:text-base text-slate-100 leading-relaxed">
                <MathText text={currentQ.question_text} />
              </div>

              {/* Input options */}
              {currentQ.type === 'NAT' ? (
                <div className="space-y-2 pt-2 sm:pt-3">
                  <span className="text-xs text-slate-400 block">Type your numeric answer:</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={userAns || ''}
                    onChange={e => handleNatInput(currentQ.id, e.target.value)}
                    placeholder="e.g. 14 or 2.5"
                    className="w-full xs:w-48 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 min-h-[44px]"
                  />
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-1 gap-2">
                    {currentQ.options?.map((opt, oIdx) => {
                      const char = String.fromCharCode(65 + oIdx);
                      const isSelected =
                        currentQ.type === 'MCQ'
                          ? userAns === char
                          : Array.isArray(userAns) && userAns.includes(char);

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleOptionSelect(currentQ, char)}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-2.5 min-h-[46px] touch-manipulation active:scale-[0.99] ${
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
                </div>
              )}

              {/* Navigation controls */}
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-slate-800">
                <button
                  onClick={() =>
                    setMarkedForReview(prev => ({
                      ...prev,
                      [currentQ.id]: !prev[currentQ.id]
                    }))
                  }
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors min-h-[40px] text-center ${
                    markedForReview[currentQ.id]
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-semibold'
                      : 'border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {markedForReview[currentQ.id] ? 'Marked for Review ★' : 'Mark for Review'}
                </button>

                <div className="flex items-center justify-end gap-2">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    className="p-2 sm:px-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 min-h-[40px] min-w-[40px] flex items-center justify-center gap-1 text-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden xs:inline">Prev</span>
                  </button>
                  <button
                    disabled={currentQuestionIndex === sessionData.questions.length - 1}
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="p-2 sm:px-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 min-h-[40px] min-w-[40px] flex items-center justify-center gap-1 text-xs"
                  >
                    <span className="hidden xs:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Palette area (4 cols, toggled on mobile) */}
          <div className={`lg:col-span-4 ${showPaletteMobile ? 'block' : 'hidden lg:block'}`}>
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Question Palette</h3>
              <div className="grid grid-cols-5 gap-2">
                {sessionData.questions.map((q, idx) => {
                  const isCurrent = currentQuestionIndex === idx;
                  const isAnswered = prevUserAnswer(q.id) !== undefined && prevUserAnswer(q.id) !== '';
                  const isMarked = markedForReview[q.id];

                  let btnColor = 'bg-slate-800 border-slate-700 text-slate-400';
                  if (isMarked) {
                    btnColor = 'bg-purple-900/60 border-purple-500 text-purple-200';
                  } else if (isAnswered) {
                    btnColor = 'bg-emerald-900/60 border-emerald-500 text-emerald-200';
                  }
                  if (isCurrent) {
                    btnColor += ' ring-2 ring-cyan-400 font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentQuestionIndex(idx);
                        setShowPaletteMobile(false);
                      }}
                      className={`h-9 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all touch-manipulation active:scale-95 ${btnColor}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-900/60 border border-emerald-500" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-purple-900/60 border border-purple-500" />
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
                  <span>Unattempted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result Breakdown
  if (testState === 'completed' && mockResult) {
    return (
      <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
        {/* Score Card Header */}
        <div className="p-4 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3 sm:space-y-4 shadow-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
            <Award className="w-4 h-4 shrink-0" /> Mock Performance Breakdown
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold text-white">
              {mockResult.scoreObtained} <span className="text-lg sm:text-xl text-slate-500 font-normal">/ {mockResult.totalMarks}</span>
            </div>
            <div className="text-xs text-slate-400">
              Scaled Qualifying Cutoff: <strong className="text-cyan-300">{mockResult.scaledCutoff}</strong> Marks
            </div>
          </div>

          <div className="pt-1">
            {mockResult.passedCutoff ? (
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs sm:text-sm font-bold">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                <span>QUALIFIED! Target Cutoff Achieved</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs sm:text-sm font-bold">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0" />
                <span>Below 35+ Target — Review Missed Questions</span>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto pt-3 sm:pt-4 text-xs">
            <div className="p-2.5 sm:p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300">
              <span className="block font-bold text-sm sm:text-base">{mockResult.correctCount}</span>
              <span className="text-[11px] sm:text-xs">Correct</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-300">
              <span className="block font-bold text-sm sm:text-base">{mockResult.incorrectCount}</span>
              <span className="text-[11px] sm:text-xs">Wrong</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-lg bg-slate-800/40 border border-slate-700/40 text-slate-400">
              <span className="block font-bold text-sm sm:text-base">{mockResult.unattemptedCount}</span>
              <span className="text-[11px] sm:text-xs">Skipped</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setTestState('idle')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white text-xs font-semibold transition-colors min-h-[44px]"
            >
              Take Another Mock Test
            </button>
          </div>
        </div>

        {/* Subject-Wise Accuracy */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 sm:space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Subject-Wise Performance</h3>
          <div className="space-y-3">
            {Object.entries(mockResult.subjectBreakdown || {}).map(([subject, stats]: any) => (
              <div key={subject} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="font-medium">{subject} (Tier {stats.tier})</span>
                  <span>{stats.marksScored.toFixed(2)} / {stats.maxMarks} Marks ({stats.correct}/{stats.total} correct)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full"
                    style={{
                      width: `${Math.max(0, Math.min(100, (stats.marksScored / stats.maxMarks) * 100))}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question-By-Question Detailed Explanations */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 sm:space-y-5">
          <h3 className="text-sm font-bold text-slate-200">Question-by-Question Review &amp; Rationale</h3>
          <div className="space-y-3 sm:space-y-4">
            {mockResult.recordedAnswers.map((ra: any, idx: number) => (
              <div
                key={ra.questionId}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400">Q{idx + 1}.</span>
                    <span className="text-slate-400">{ra.subjectName} ({ra.type})</span>
                  </div>
                  <div className="font-mono font-semibold">
                    {ra.marksObtained > 0 ? (
                      <span className="text-emerald-400">+{ra.marksObtained} Marks</span>
                    ) : ra.marksObtained < 0 ? (
                      <span className="text-rose-400">{ra.marksObtained} Marks (Penalty)</span>
                    ) : (
                      <span className="text-slate-500">0 Marks</span>
                    )}
                  </div>
                </div>

                <div className="text-slate-200 text-sm">
                  <MathText text={ra.questionText} />
                </div>

                <div className="pt-2 text-slate-400 flex flex-wrap gap-4 border-t border-slate-800">
                  <div>
                    Your Answer: <strong className="text-white">{ra.userAnswer || 'Skipped'}</strong>
                  </div>
                  <div>
                    Correct Answer: <strong className="text-emerald-400">{ra.correctAnswer}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 text-slate-300 mt-2">
                  <span className="font-semibold text-cyan-400 block mb-1">Explanation:</span>
                  <MathText text={ra.explanation} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
