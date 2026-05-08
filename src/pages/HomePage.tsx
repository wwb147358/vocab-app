import { useState } from 'react'
import { FlashCard } from '../components/learn/FlashCard'
import { QuizMode } from '../components/learn/QuizMode'
import { Dictation } from '../components/learn/Dictation'
import { useVocab } from '../context/VocabContext'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import { LearnMode, Vocabulary } from '../types'

export function HomePage() {
  const [mode, setMode] = useState<LearnMode>('flashcard')
  const [currentIndex, setCurrentIndex] = useState(0)
  const { vocabularies, progress } = useVocab()
  const { recordAnswer } = useSpacedRepetition()

  // 获取待学习的词汇
  const dueVocabularies = vocabularies.filter(v => {
    const p = progress.get(v.id)
    if (!p) return true // 新词
    return p.next_review && new Date(p.next_review) <= new Date()
  })

  const currentVocab = dueVocabularies[currentIndex] || vocabularies[0]
  const quizOptions = getRandomOptions(currentVocab, vocabularies)

  function getRandomOptions(vocab: Vocabulary, all: Vocabulary[]): Vocabulary[] {
    const others = all.filter(v => v.id !== vocab.id)
    const shuffled = others.sort(() => Math.random() - 0.5)
    return [vocab, ...shuffled.slice(0, 3)].sort(() => Math.random() - 0.5)
  }

  const handleAnswer = async (correct: boolean) => {
    await recordAnswer(currentVocab.id, correct)
    setCurrentIndex(i => (i + 1) % dueVocabularies.length)
  }

  return (
    <div className="p-4">
      {/* Mode Selector */}
      <div className="flex justify-center gap-2 mb-6">
        {(['flashcard', 'quiz', 'dictation'] as LearnMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg ${
              mode === m ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            {m === 'flashcard' ? '闪卡' : m === 'quiz' ? '测试' : '默写'}
          </button>
        ))}
      </div>

      {/* Due count */}
      <p className="text-center text-gray-500 mb-4">
        今日待复习：{dueVocabularies.length} 个词汇
      </p>

      {/* Learning Component */}
      <div className="min-h-[60vh] flex items-center justify-center">
        {mode === 'flashcard' && (
          <FlashCard vocab={currentVocab} onAnswer={handleAnswer} />
        )}
        {mode === 'quiz' && (
          <QuizMode vocab={currentVocab} options={quizOptions} onAnswer={handleAnswer} />
        )}
        {mode === 'dictation' && (
          <Dictation vocab={currentVocab} onAnswer={handleAnswer} />
        )}
      </div>
    </div>
  )
}