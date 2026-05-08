import { useState, useEffect } from 'react'
import { Vocabulary } from '../../types'

interface QuizModeProps {
  vocab: Vocabulary
  options: Vocabulary[]
  onAnswer: (correct: boolean) => void
}

export function QuizMode({ vocab, options, onAnswer }: QuizModeProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    setSelected(null)
    setShowResult(false)
  }, [vocab.id])

  const handleSelect = (optionId: number) => {
    if (showResult) return
    setSelected(optionId)
    setShowResult(true)
    const correct = optionId === vocab.id
    setTimeout(() => onAnswer(correct), 1500)
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{vocab.word}</h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            disabled={showResult}
            className={`p-4 rounded-xl text-left transition-colors ${
              showResult
                ? opt.id === vocab.id
                  ? 'bg-green-100 border-2 border-green-500'
                  : opt.id === selected
                  ? 'bg-red-100 border-2 border-red-500'
                  : 'bg-gray-100'
                : 'bg-white border-2 border-gray-200 hover:border-purple-400'
            }`}
          >
            {opt.chinese}
          </button>
        ))}
      </div>
    </div>
  )
}