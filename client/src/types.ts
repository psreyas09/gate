export type Tier = 1 | 2 | 3;

export interface Subject {
  id: string;
  name: string;
  tier: Tier;
  priority_weight: number;
  reference_book: string;
  citation_info: string;
  topic_count?: number;
  lesson_count?: number;
  question_count?: number;
  completed_lessons?: number;
}

export interface Topic {
  id: string;
  subject_id: string;
  name: string;
  order_index: number;
  is_high_yield: number;
  estimated_study_mins: number;
  subject_name?: string;
  subject_tier?: Tier;
  reference_book?: string;
  lesson_id?: string;
  lesson_title?: string;
  lesson_citation?: string;
  lesson_status?: 'not_started' | 'in_progress' | 'completed';
  quick_checks_passed?: number;
  question_count?: number;
  flashcard_count?: number;
}

export interface QuickCheck {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  topic_id: string;
  title: string;
  content_markdown: string;
  quick_check_questions: QuickCheck[];
  citation: string;
  topic_name?: string;
  is_high_yield?: number;
  subject_name?: string;
  tier?: Tier;
  reference_book?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
  quick_checks_passed?: number;
  completed_at?: string;
}

export interface Question {
  id: string;
  subject_id: string;
  topic_id: string;
  type: 'MCQ' | 'MSQ' | 'NAT';
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string;
  is_pyq: number;
  pyq_year?: number;
  pyq_session?: string;
  subject_name?: string;
  tier?: Tier;
  topic_name?: string;
  is_high_yield?: number;
  reference_book?: string;
  user_attempts_count?: number;
  last_attempt_correct?: number;
}

export interface SpacedRepetitionCard {
  id: string;
  item_type: 'flashcard' | 'question' | 'lesson';
  item_id: string;
  repetition: number;
  interval_days: number;
  ease_factor: number;
  due_date: string;
  last_reviewed_at: string | null;
  last_rating: number | null;
  flashcard_front?: string;
  flashcard_back?: string;
  flashcard_citation?: string;
  question_text?: string;
  question_options?: string[];
  question_type?: 'MCQ' | 'MSQ' | 'NAT';
  correct_answer?: string;
  question_explanation?: string;
  topic_name?: string;
  subject_name?: string;
  subject_tier?: Tier;
  is_high_yield?: number;
}

export interface MockSession {
  id: string;
  title: string;
  total_marks: number;
  score_obtained: number;
  target_cutoff: number;
  passed_cutoff: number;
  duration_seconds: number;
  time_spent_seconds: number;
  subject_breakdown: Record<string, { total: number; correct: number; marksScored: number; maxMarks: number; tier: number }>;
  created_at: string;
}

export interface OverviewData {
  totalLessons: number;
  completedLessons: number;
  overallProgressPct: number;
  tierStats: Array<{ tier: Tier; total_lessons: number; completed_lessons: number }>;
  dueReviews: number;
  weakTopics: Array<{
    id: string;
    topic_name: string;
    subject_name: string;
    tier: Tier;
    is_high_yield: number;
    total_attempts: number;
    correct_attempts: number;
    accuracy: number;
  }>;
  overallAttempts: number;
  overallCorrect: number;
  overallAccuracy: number;
  mockSummary: {
    total_mocks: number;
    high_score: number;
    latest_score: number;
    latest_passed: number;
  };
  streak: number;
  settings: {
    target_exam_date?: string;
    target_cutoff?: string;
    current_mode?: 'full' | 'light';
    daily_target_lessons?: string;
    daily_target_reviews?: string;
    busy_periods?: string;
  };
}
