export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TextRow {
  id: number;
  filename: string;
  title: string;
  author?: string | null;
  category?: string | null;
  word_count?: number | null;
  difficulty?: Difficulty | null;
  last_practiced?: string | null; // ISO
  times_practiced: number;
  created_at: string; // ISO
}

export interface PracticeSessionRow {
  id: number;
  text_id: number;
  started_at: string;
  ended_at?: string | null;
  exercise_type?: string | null;
  lesson_number?: number | null;
  exercise_number?: number | null;
  wpm?: number | null;
  accuracy?: number | null;
  characters_typed?: number | null;
  errors?: number | null;
  completed: number; // 0/1
}

export interface UserProgressRow {
  id: number;
  date: string; // YYYY-MM-DD
  total_practice_time?: number | null;
  average_wpm?: number | null;
  average_accuracy?: number | null;
  texts_practiced?: number | null;
  exercises_completed?: number | null;
}


