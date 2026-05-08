import { useVocab } from '../context/VocabContext'

export function ProgressPage() {
  const { vocabularies, progress } = useVocab()

  const mastered = vocabularies.filter(v => {
    const p = progress.get(v.id)
    return p && p.level >= 3
  }).length

  const learning = vocabularies.filter(v => {
    const p = progress.get(v.id)
    return p && p.level > 0 && p.level < 3
  }).length

  const newWords = vocabularies.length - mastered - learning
  const todayDue = vocabularies.filter(v => {
    const p = progress.get(v.id)
    if (!p) return true
    return p.next_review && new Date(p.next_review) <= new Date()
  }).length

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">学习进度</h1>

      {/* Progress Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#667eea"
              strokeWidth="12"
              strokeDasharray={`${(mastered / vocabularies.length) * 440} 440`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-purple-600">{mastered}</span>
            <span className="text-sm text-gray-500">已掌握</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <div className="text-2xl font-bold text-green-600">{learning}</div>
          <div className="text-sm text-gray-500">学习中</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <div className="text-2xl font-bold text-gray-600">{newWords}</div>
          <div className="text-sm text-gray-500">新词</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <div className="text-2xl font-bold text-purple-600">{todayDue}</div>
          <div className="text-sm text-gray-500">今日待复习</div>
        </div>
      </div>

      {/* Total */}
      <div className="bg-purple-50 p-4 rounded-xl text-center">
        <span className="text-gray-600">总词汇量：</span>
        <span className="font-bold text-purple-600">{vocabularies.length}</span>
      </div>
    </div>
  )
}
