import { useState } from 'react'
import { Vocabulary } from '../../types'

interface DictationProps {
  vocab: Vocabulary
  onAnswer: (correct: boolean) => void
}

export function Dictation({ vocab, onAnswer }: DictationProps) {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (submitted) return
    setSubmitted(true)
    const correct = input.trim().toLowerCase() === vocab.word.toLowerCase()
    setTimeout(() => {
      onAnswer(correct)
      setInput('')
      setSubmitted(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">{vocab.chinese}</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={submitted}
          placeholder="输入英文单词"
          className={`w-full p-4 text-xl border-2 rounded-xl text-center focus:outline-none ${
            submitted
              ? input.trim().toLowerCase() === vocab.word.toLowerCase()
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
              : 'border-gray-300 focus:border-purple-500'
          }`}
        />
        {submitted && (
          <div className="mt-4 text-center">
            {input.trim().toLowerCase() === vocab.word.toLowerCase() ? (
              <span className="text-green-600 text-lg">正确！</span>
            ) : (
              <div>
                <span className="text-red-600 text-lg">错误，正确答案是：</span>
                <span className="text-xl font-bold text-purple-600 ml-2">{vocab.word}</span>
              </div>
            )}
          </div>
        )}
        <button
          type="submit"
          disabled={submitted || !input.trim()}
          className="w-full mt-4 p-4 bg-purple-600 text-white rounded-xl disabled:opacity-50"
        >
          提交
        </button>
      </form>
    </div>
  )
}