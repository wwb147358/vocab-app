import { useVocab } from '../context/VocabContext'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'

export function WrongAnswersPage() {
  const { wrongAnswers, removeWrongAnswer, clearWrongAnswers, refreshProgress } = useVocab()
  const { recordAnswer } = useSpacedRepetition()

  const handleContinueLearning = async (vocabId: number) => {
    // 记录为错误，重置进度到 level 1
    await recordAnswer(vocabId, false)
    await refreshProgress()
    // 从错题本移除
    removeWrongAnswer(vocabId)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">错题本</h1>
        {wrongAnswers.length > 0 && (
          <button
            onClick={clearWrongAnswers}
            className="text-sm text-red-500 hover:underline"
          >
            清空全部
          </button>
        )}
      </div>

      {wrongAnswers.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-4xl mb-4">📝</p>
          <p>暂无错题记录</p>
          <p className="text-sm mt-2">继续加油！</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-500 text-sm mb-4">共 {wrongAnswers.length} 道错题</p>
          {wrongAnswers.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{item.vocab.word}</span>
                    <span className="text-sm text-gray-400">
                      {new Date(item.timestamp).toLocaleString('zh-CN', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{item.vocab.chinese}</p>
                  {item.vocab.english_def && (
                    <p className="text-gray-400 text-sm mt-1">{item.vocab.english_def}</p>
                  )}
                </div>
                <button
                  onClick={() => handleContinueLearning(item.vocab.id)}
                  className="text-blue-500 hover:text-blue-700 text-sm ml-2"
                >
                  继续学习
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
