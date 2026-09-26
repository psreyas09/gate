import { Subject, Topic } from '../types';

let cachedSubjects: Subject[] | null = null;
const cachedTopics = new Map<string, { data: Topic[]; timestamp: number }>();
const TOPICS_TTL_MS = 60 * 1000; // 60 seconds

export function getCachedSubjects(): Subject[] | null {
  if (cachedSubjects) return cachedSubjects;
  try {
    const raw = localStorage.getItem('gate_cached_subjects');
    if (raw) {
      cachedSubjects = JSON.parse(raw);
      return cachedSubjects;
    }
  } catch {}
  return null;
}

export function setCachedSubjects(subjects: Subject[]): void {
  cachedSubjects = subjects;
  try {
    localStorage.setItem('gate_cached_subjects', JSON.stringify(subjects));
  } catch {}
}

export function getCachedTopics(subjectId: string, scope?: string): Topic[] | null {
  const key = `${subjectId}_${scope || 'all'}`;
  const entry = cachedTopics.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TOPICS_TTL_MS) {
    cachedTopics.delete(key);
    return null;
  }
  return entry.data;
}

export function setCachedTopics(subjectId: string, scope: string | undefined, topics: Topic[]): void {
  const key = `${subjectId}_${scope || 'all'}`;
  cachedTopics.set(key, { data: topics, timestamp: Date.now() });
}
