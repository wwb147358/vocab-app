import { createContext, useContext, useState, useEffect } from 'react'
import { Vocabulary, UserProgress } from '../types'
import { parseVocabularyCSV } from '../lib/vocabulary'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface VocabContextType {
  vocabularies: Vocabulary[]
  progress: Map<number, UserProgress>
  loading: boolean
  refreshProgress: () => Promise<void>
  currentFlashcardId: number
  setCurrentFlashcardId: (id: number) => void
  currentQuizId: number
  setCurrentQuizId: (id: number) => void
  currentDictationId: number
  setCurrentDictationId: (id: number) => void
}

const VocabContext = createContext<VocabContextType | undefined>(undefined)

export function VocabProvider({ children }: { children: React.ReactNode }) {
  const [vocabularies] = useState<Vocabulary[]>(() => parseVocabularyCSV())
  const [progress, setProgress] = useState<Map<number, UserProgress>>(new Map())
  const [loading, setLoading] = useState(false)
  const [currentFlashcardId, setCurrentFlashcardId] = useState<number>(1)
  const [currentQuizId, setCurrentQuizId] = useState<number>(1)
  const [currentDictationId, setCurrentDictationId] = useState<number>(1)
  const { user } = useAuth()

  const refreshProgress = async () => {
    if (!user) {
      setProgress(new Map())
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
    const map = new Map<number, UserProgress>()
    data?.forEach(p => map.set(p.vocab_id, p))
    setProgress(map)
    setLoading(false)
  }

  useEffect(() => {
    refreshProgress()
  }, [user])

  return (
    <VocabContext.Provider value={{
      vocabularies,
      progress,
      loading,
      refreshProgress,
      currentFlashcardId,
      setCurrentFlashcardId,
      currentQuizId,
      setCurrentQuizId,
      currentDictationId,
      setCurrentDictationId
    }}>
      {children}
    </VocabContext.Provider>
  )
}

export function useVocab() {
  const context = useContext(VocabContext)
  if (context === undefined) {
    throw new Error('useVocab must be used within a VocabProvider')
  }
  return context
}
