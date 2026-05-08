import { useState } from 'react'
import { useVocab } from '../context/VocabContext'

type Filter = 'all' | 'new' | 'learning' | 'mastered'

export function LibraryPage() {
  const { vocabularies, progress } = useVocab()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = vocabularies.filter(v => {
    const p = progress.get(v.id)
    const matchesSearch = v.word.toLowerCase().includes(search.toLowerCase()) ||
                          v.chinese.includes(search)

    if (!matchesSearch) return false

    if (filter === 'all') return true
    if (filter === 'new') return !p
    if (filter === 'learning') return p && p.level > 0 && p.level < 3
    if (filter === 'mastered') return p && p.level >= 3

    return true
  })

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">词库</h1>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="搜索词汇..."
        className="w-full p-3 border rounded-xl mb-4"
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {(['all', 'new', 'learning', 'mastered'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              filter === f ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            {f === 'all' ? '全部' : f === 'new' ? '新词' : f === 'learning' ? '学习中' : '已掌握'}
          </button>
        ))}
      </div>

      {/* Word List */}
      <div className="space-y-2">
        {filtered.map(v => {
          const p = progress.get(v.id)
          const status = !p ? '新词' : p.level >= 3 ? '已掌握' : '学习中'
          const statusColor = !p ? 'text-gray-500' : p.level >= 3 ? 'text-green-600' : 'text-yellow-600'

          return (
            <div key={v.id} className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-lg">{v.word}</span>
                  <p className="text-gray-600">{v.chinese}</p>
                </div>
                <span className={`text-sm ${statusColor}`}>{status}</span>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-8">没有找到匹配的词汇</p>
      )}
    </div>
  )
}
