import { useState } from 'react'
import { Vocabulary } from '../../types'

interface FlashCardProps {
  vocab: Vocabulary
  onAnswer: (correct: boolean) => void
}

export function FlashCard({ vocab, onAnswer }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false)

  const handleFlipAndAnswer = (correct: boolean) => {
    setFlipped(true)
    // 延迟2秒执行答题，以便用户看到答案
    setTimeout(() => {
      onAnswer(correct)
      setFlipped(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div
        className="w-80 h-48 cursor-pointer perspective-1000"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute w-full h-full bg-white rounded-xl shadow-lg flex items-center justify-center backface-hidden">
            <span className="text-3xl font-bold text-gray-800">{vocab.word}</span>
          </div>
          {/* Back */}
          <div className="absolute w-full h-full bg-purple-50 rounded-xl shadow-lg flex flex-col items-center justify-center backface-hidden rotate-y-180">
            <span className="text-xl text-gray-800 mb-2">{vocab.chinese}</span>
            {vocab.english_def && (
              <span className="text-sm text-gray-500">{vocab.english_def}</span>
            )}
          </div>
        </div>
      </div>
      <p className="text-gray-400 mt-4 text-sm">点击卡片查看答案</p>
      <div className="flex gap-4 mt-6">
        <button onClick={() => handleFlipAndAnswer(false)} className="px-6 py-2 bg-red-100 text-red-600 rounded-lg">不认识</button>
        <button onClick={() => handleFlipAndAnswer(true)} className="px-6 py-2 bg-green-100 text-green-600 rounded-lg">认识</button>
      </div>
    </div>
  )
}
