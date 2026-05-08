export interface Vocabulary {
  id: number
  word: string
  chinese: string
  english_def: string | null
}

export interface UserProgress {
  id: number
  user_id: string
  vocab_id: number
  level: number  // 0=新词, 1=Lv.1, 2=Lv.2, 3=Lv.3, 4=掌握
  next_review: string | null
  correct_count: number
  last_reviewed: string | null
}

export type LearnMode = 'flashcard' | 'quiz' | 'dictation'

export interface ReviewResult {
  vocabId: number
  correct: boolean
}