import { useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const LEVEL_INTERVALS: Record<number, number> = {
  0: 0,                    // 新词 - 立即
  1: 1 * 24 * 60 * 60 * 1000,   // 1天
  2: 3 * 24 * 60 * 60 * 1000,   // 3天
  3: 7 * 24 * 60 * 60 * 1000,   // 7天
  4: 30 * 24 * 60 * 60 * 1000   // 30天
}

export function useSpacedRepetition() {
  const { user } = useAuth()

  const getNextReviewTime = useCallback((currentLevel: number): Date => {
    const interval = LEVEL_INTERVALS[currentLevel + 1] || LEVEL_INTERVALS[4]
    return new Date(Date.now() + interval)
  }, [])

  const recordAnswer = useCallback(async (vocabId: number, correct: boolean) => {
    if (!user) return

    const { data: existing } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('vocab_id', vocabId)
      .single()

    if (correct) {
      const newLevel = Math.min((existing?.level || 0) + 1, 4)
      const nextReview = getNextReviewTime(newLevel)

      if (existing) {
        await supabase
          .from('user_progress')
          .update({ level: newLevel, next_review: nextReview.toISOString(), correct_count: (existing.correct_count || 0) + 1, last_reviewed: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('user_progress')
          .insert({ user_id: user.id, vocab_id: vocabId, level: 1, next_review: nextReview.toISOString(), correct_count: 1, last_reviewed: new Date().toISOString() })
      }
    } else {
      if (existing) {
        await supabase
          .from('user_progress')
          .update({ level: 1, correct_count: 0, last_reviewed: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('user_progress')
          .insert({ user_id: user.id, vocab_id: vocabId, level: 0, correct_count: 0, last_reviewed: new Date().toISOString() })
      }
    }
  }, [user, getNextReviewTime])

  const getDueVocabularies = useCallback(async () => {
    if (!user) return []
    const now = new Date().toISOString()
    const { data } = await supabase
      .from('user_progress')
      .select('*, vocabularies(*)')
      .eq('user_id', user.id)
      .lte('next_review', now)
    return data || []
  }, [user])

  return { recordAnswer, getNextReviewTime, getDueVocabularies }
}