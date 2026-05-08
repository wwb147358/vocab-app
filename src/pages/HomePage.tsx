import { useState } from 'react'
import { FlashCard } from '../components/learn/FlashCard'
import { QuizMode } from '../components/learn/QuizMode'
import { Dictation } from '../components/learn/Dictation'
import { useVocab } from '../context/VocabContext'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import { LearnMode, Vocabulary } from '../types'

export function HomePage() {
  const [mode, setMode] = useState<LearnMode>('flashcard')
  const {
    vocabularies,
    progress,
    refreshProgress,
    currentFlashcardId,
    setCurrentFlashcardId,
    currentQuizId,
    setCurrentQuizId,
    currentDictationId,
    setCurrentDictationId,
    addWrongAnswer
  } = useVocab()
  const { recordAnswer } = useSpacedRepetition()

  // 获取待学习的词汇
  const dueVocabularies = vocabularies.filter(v => {
    const p = progress.get(v.id)
    if (!p) return true // 新词
    return p.next_review && new Date(p.next_review) <= new Date()
  })

  // 根据当前模式获取当前词汇
  const getCurrentId = () => {
    if (mode === 'flashcard') return currentFlashcardId
    if (mode === 'quiz') return currentQuizId
    return currentDictationId
  }

  const setCurrentId = (id: number) => {
    if (mode === 'flashcard') setCurrentFlashcardId(id)
    else if (mode === 'quiz') setCurrentQuizId(id)
    else setCurrentDictationId(id)
  }

  const currentId = getCurrentId()
  const currentIndexInDue = dueVocabularies.findIndex(v => v.id === currentId)
  const displayIndex = currentIndexInDue >= 0 ? currentIndexInDue : 0
  const currentVocab = dueVocabularies[displayIndex] || vocabularies[0]
  const quizOptions = getRandomOptions(currentVocab, vocabularies)

  function getRandomOptions(vocab: Vocabulary, all: Vocabulary[]): Vocabulary[] {
    const others = all.filter(v => v.id !== vocab.id)
    const shuffled = others.sort(() => Math.random() - 0.5)
    return [vocab, ...shuffled.slice(0, 3)].sort(() => Math.random() - 0.5)
  }

  const handleAnswer = async (correct: boolean) => {
    // 只有闪卡模式才更新进度
    if (mode === 'flashcard') {
      await recordAnswer(currentVocab.id, correct)
      await refreshProgress()
    } else if (!correct) {
      // 测试和默写模式：答错时记录到错题本
      addWrongAnswer(currentVocab)
    }

    // 移动到下一个（仅更新当前模式的索引）
    const nextIndex = displayIndex < dueVocabularies.length - 1 ? displayIndex + 1 : 0
    const nextVocab = dueVocabularies[nextIndex] || vocabularies[0]
    setCurrentId(nextVocab.id)
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

      {/* Due count - 只有闪卡模式显示 */}
      {mode === 'flashcard' && (
        <p className="text-center text-gray-500 mb-4">
          今日待复习：{dueVocabularies.length} 个词汇
        </p>
      )}

      {/* Learning Component */}
      <div className="min-h-[60vh] flex items-center justify-center">
        {mode === 'flashcard' ? (
          dueVocabularies.length === 0 ? (
            <div className="text-center text-gray-500">
              <p className="text-xl mb-2">🎉</p>
              <p>今日复习已完成！</p>
              <p className="text-sm mt-2">明天再来学习更多词汇吧~</p>
            </div>
          ) : (
            <FlashCard vocab={currentVocab} onAnswer={handleAnswer} />
          )
        ) : mode === 'quiz' ? (
          <QuizMode vocab={currentVocab} options={quizOptions} onAnswer={handleAnswer} />
        ) : (
          <Dictation vocab={currentVocab} onAnswer={handleAnswer} />
        )}
      </div>
    </div>
  )
}
