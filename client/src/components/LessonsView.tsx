import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  BookMarked,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';
import { Subject, Topic, Lesson, Tier } from '../types';
import { MathText } from './MathText';

interface LessonsViewProps {
  onProgressUpdated: () => void;
  selectedTopicId?: string | null;
}

export const LessonsView: React.FC<LessonsViewProps> = ({ onProgressUpdated, selectedTopicId: initialTopicId }) => {
  const [activeTier, setActiveTier] = useState<Tier>(1);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'topics' | 'lesson'>('topics');

  // Quick check answers state: { [qc_id]: selectedOptionIndex }
  const [quickCheckAnswers, setQuickCheckAnswers] = useState<Record<string, number>>({});
  const [submittingCheck, setSubmittingCheck] = useState(false);
  const [checkFeedback, setCheckFeedback] = useState<any>(null);

  // 1. Fetch subjects on mount
  useEffect(() => {
    fetch('/api/subjects')
      .then(res => res.json())
      .then((data: Subject[]) => {
        setSubjects(data);
        const firstTier1 = data.find(s => s.tier === 1);
        if (firstTier1 && !selectedSubjectId) {
          setSelectedSubjectId(firstTier1.id);
        }
      })
      .catch(console.error);
  }, []);

  // 2. Fetch topics when selected subject changes, and auto-load the first topic's lesson!
  useEffect(() => {
    if (!selectedSubjectId) return;
    setLoading(true);
    fetch(`/api/topics?subject_id=${selectedSubjectId}`)
      .then(res => res.json())
      .then((data: Topic[]) => {
        setTopics(data);
        setLoading(false);

        // Auto-select topic:
        // Either initialTopicId if specified, or first topic with a lesson
        let targetTopic: Topic | undefined;
        if (initialTopicId) {
          targetTopic = data.find(top => top.id === initialTopicId);
        }
        if (!targetTopic && data.length > 0) {
          targetTopic = data.find(top => top.lesson_id) || data[0];
        }

        if (targetTopic && targetTopic.lesson_id) {
          loadLesson(targetTopic.lesson_id, false);
        } else {
          setSelectedLesson(null);
        }
      })
      .catch(() => setLoading(false));
  }, [selectedSubjectId, initialTopicId]);

  const loadLesson = async (lessonId: string, switchMobileToLesson: boolean = true) => {
    setLoading(true);
    setCheckFeedback(null);
    setQuickCheckAnswers({});
    if (switchMobileToLesson) {
      setMobileViewMode('lesson');
    }
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      const data = await res.json();
      setSelectedLesson(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuickCheck = (qcId: string, optionIdx: number) => {
    if (checkFeedback?.allCorrect) return; // already completed
    setQuickCheckAnswers(prev => ({ ...prev, [qcId]: optionIdx }));
  };

  const handleSubmitQuickChecks = async () => {
    if (!selectedLesson) return;
    setSubmittingCheck(true);
    try {
      const res = await fetch(`/api/lessons/${selectedLesson.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: quickCheckAnswers, timeSpentSecs: 90 })
      });
      const data = await res.json();
      setCheckFeedback(data);
      if (data.allCorrect) {
        setSelectedLesson(prev => prev ? { ...prev, status: 'completed' } : null);
        // Refresh topics list so green checkmark updates
        fetch(`/api/topics?subject_id=${selectedSubjectId}`)
          .then(r => r.json())
          .then(tData => setTopics(tData))
          .catch(() => {});
        onProgressUpdated();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingCheck(false);
    }
  };

  const handleTierSwitch = (tier: Tier) => {
    setActiveTier(tier);
    const sub = subjects.find(s => s.tier === tier);
    if (sub) {
      setSelectedSubjectId(sub.id);
    }
    setMobileViewMode('topics');
  };

  const filteredSubjects = subjects.filter(s => s.tier === activeTier);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Tier Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Interactive Syllabus &amp; Lessons</h2>
          <p className="text-xs text-slate-400">
            Bite-sized high-yield explanations with required retrieval quick checks before completion.
          </p>
        </div>

        <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl space-x-1 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleTierSwitch(1)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
              activeTier === 1
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tier 1 (Full Depth)
          </button>
          <button
            onClick={() => handleTierSwitch(2)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
              activeTier === 2
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tier 2 (Core)
          </button>
          <button
            onClick={() => handleTierSwitch(3)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
              activeTier === 3
                ? 'bg-slate-700/40 text-slate-300 border border-slate-600/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tier 3 (Light)
          </button>
        </div>
      </div>

      {/* Subject Selector Buttons (Horizontal Scroll on Mobile) */}
      <div className="overflow-x-auto no-scrollbar py-1 -my-1">
        <div className="flex gap-2 min-w-max sm:flex-wrap">
          {filteredSubjects.map(sub => {
            const isSelected = sub.id === selectedSubjectId;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubjectId(sub.id);
                  setMobileViewMode('topics');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border touch-manipulation whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600/25 border-indigo-500/50 text-indigo-300 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{sub.name}</span>
                {sub.completed_lessons && sub.completed_lessons > 0 ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile-Only Master-Detail Switcher Bar */}
      <div className="lg:hidden flex rounded-xl bg-slate-900/90 border border-slate-800 p-1 text-xs font-medium">
        <button
          onClick={() => setMobileViewMode('topics')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileViewMode === 'topics'
              ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Topics List ({topics.length})</span>
        </button>
        <button
          onClick={() => setMobileViewMode('lesson')}
          disabled={!selectedLesson}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 ${
            mobileViewMode === 'lesson'
              ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Lesson Content</span>
          {selectedLesson?.status === 'completed' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {/* Main Content Area: Sidebar Topics + Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Topic List (4 columns on desktop, conditional on mobile) */}
        <div className={`space-y-3 lg:col-span-4 ${mobileViewMode === 'topics' ? 'block' : 'hidden lg:block'}`}>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Topics ({topics.length})
              </span>
              <span className="text-[11px] text-cyan-400 font-medium">★ = High Yield</span>
            </div>

            {loading && topics.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading topics...</div>
            ) : topics.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">No topics found for this subject.</div>
            ) : (
              <div className="space-y-2">
                {topics.map(t => {
                  const isCurrent = selectedLesson?.topic_id === t.id;
                  const isCompleted = t.lesson_status === 'completed';

                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        if (t.lesson_id) {
                          loadLesson(t.lesson_id, true);
                        }
                      }}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all touch-manipulation active:scale-[0.99] ${
                        isCurrent
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200 ring-1 ring-cyan-500/30'
                          : 'bg-slate-800/40 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {t.is_high_yield === 1 && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                High-Yield
                              </span>
                            )}
                            <span className="text-xs font-medium leading-snug">{t.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span>{t.estimated_study_mins} mins</span>
                            {t.question_count ? <span>• {t.question_count} questions</span> : null}
                          </div>
                        </div>

                        {/* Status Icon */}
                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-emerald-400 shrink-0 mt-0.5" title="Lesson Mastered">
                            <CheckCircle className="w-4 h-4 fill-emerald-500/20 text-emerald-400" />
                          </div>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Lesson Reader (8 columns on desktop, conditional on mobile) */}
        <div className={`lg:col-span-8 ${mobileViewMode === 'lesson' ? 'block' : 'hidden lg:block'}`}>
          {selectedLesson ? (
            <div className="space-y-5 sm:space-y-6">
              {/* Mobile Back to Topics Button */}
              <div className="lg:hidden flex items-center justify-between pb-1">
                <button
                  onClick={() => setMobileViewMode('topics')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 p-1"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span>Back to Topics List</span>
                </button>
                <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                  {selectedLesson.subject_name}
                </span>
              </div>

              {/* Lesson Header */}
              <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                      {selectedLesson.subject_name}
                    </span>
                    {selectedLesson.is_high_yield === 1 && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                        High Yield Spotlight
                      </span>
                    )}
                  </div>
                  {selectedLesson.status === 'completed' && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Completed &amp; Scheduled in SM-2
                    </div>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-white">{selectedLesson.title}</h1>

                {/* Authoritative Citation */}
                {selectedLesson.citation && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                    <BookMarked className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      <strong className="text-cyan-300 font-semibold">Standard Reference:</strong> {selectedLesson.citation}
                    </span>
                  </div>
                )}

                {/* Content Markdown with KaTeX */}
                <div className="pt-2 text-slate-200">
                  <MathText text={selectedLesson.content_markdown} />
                </div>
              </div>

              {/* Retrieval Practice: Quick Check Questions */}
              {selectedLesson.quick_check_questions && selectedLesson.quick_check_questions.length > 0 && (
                <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 sm:space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Required Retrieval Quick-Checks ({selectedLesson.quick_check_questions.length} Questions)</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Answer all questions correctly to verify active recall and mark this lesson as completed.
                      </p>
                    </div>
                    {checkFeedback?.allCorrect && (
                      <span className="self-start sm:self-auto text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        {selectedLesson.quick_check_questions.length}/{selectedLesson.quick_check_questions.length} Passed
                      </span>
                    )}
                  </div>

                  {checkFeedback && !checkFeedback.allCorrect && (
                    <div className="p-3 sm:p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2">
                      <span>
                        You got {checkFeedback.passedCount} of {checkFeedback.totalCount} correct. Review explanations below and retry.
                      </span>
                      <button
                        onClick={() => setCheckFeedback(null)}
                        className="underline font-semibold hover:text-white shrink-0 p-1"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  <div className="space-y-4 sm:space-y-6">
                    {selectedLesson.quick_check_questions.map((qc, qIdx) => {
                      const selectedIdx = quickCheckAnswers[qc.id];
                      const feedbackItem = checkFeedback?.feedback?.find((f: any) => f.id === qc.id);

                      return (
                        <div key={qc.id} className="p-3.5 sm:p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
                          <div className="font-medium text-xs sm:text-sm text-slate-100 flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs shrink-0 font-bold text-cyan-400">
                              {qIdx + 1}
                            </span>
                            <span className="flex-1 leading-snug">{qc.question}</span>
                          </div>

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {qc.options.map((opt, oIdx) => {
                              const isSelected = selectedIdx === oIdx;
                              let btnStyle = 'bg-slate-900/60 border-slate-700 hover:border-slate-500 text-slate-300';

                              if (feedbackItem) {
                                if (oIdx === feedbackItem.correctIndex) {
                                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                                } else if (isSelected && !feedbackItem.isCorrect) {
                                  btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 line-through';
                                }
                              } else if (isSelected) {
                                btnStyle = 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-medium';
                              }

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectQuickCheck(qc.id, oIdx)}
                                  disabled={Boolean(checkFeedback?.allCorrect)}
                                  className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-2 min-h-[44px] touch-manipulation active:scale-[0.99] ${btnStyle}`}
                                >
                                  <span className="font-bold opacity-70 shrink-0">
                                    {String.fromCharCode(65 + oIdx)}.
                                  </span>
                                  <span className="flex-1 leading-snug">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Immediate Explanation */}
                          {feedbackItem && (
                            <div
                              className={`p-3 rounded-lg text-xs mt-2 border ${
                                feedbackItem.isCorrect
                                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                              }`}
                            >
                              <div className="font-semibold mb-1 flex items-center gap-1.5">
                                {feedbackItem.isCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Correct Answer: Option {String.fromCharCode(65 + feedbackItem.correctIndex)}</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                    <span>Incorrect. Correct Answer: Option {String.fromCharCode(65 + feedbackItem.correctIndex)}</span>
                                  </>
                                )}
                              </div>
                              <p className="leading-relaxed opacity-90">{feedbackItem.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit Action */}
                  <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-400 order-2 sm:order-1 text-center sm:text-left">
                      {Object.keys(quickCheckAnswers).length} of {selectedLesson.quick_check_questions.length} answered
                    </div>
                    <button
                      onClick={handleSubmitQuickChecks}
                      disabled={
                        submittingCheck ||
                        Object.keys(quickCheckAnswers).length < selectedLesson.quick_check_questions.length ||
                        Boolean(checkFeedback?.allCorrect)
                      }
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-semibold shadow-lg shadow-cyan-900/40 transition-all flex items-center justify-center gap-2 min-h-[44px] order-1 sm:order-2"
                    >
                      {submittingCheck ? 'Evaluating...' : checkFeedback?.allCorrect ? 'Completed ✓' : 'Submit Quick Checks & Complete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-slate-300">Select a Topic to Start Studying</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Pick any topic from the list to view the bite-sized lesson, reference citations, and retrieval check questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
