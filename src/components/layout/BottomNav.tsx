import { Link, useLocation } from 'react-router-dom'
import { useVocab } from '../../context/VocabContext'

export function BottomNav() {
  const location = useLocation()
  const { wrongAnswers } = useVocab()
  const tabs = [
    { path: '/', label: '学习', icon: '📚' },
    { path: '/progress', label: '进度', icon: '📊' },
    { path: '/wrong-answers', label: '错题', icon: '📝' },
    { path: '/library', label: '词库', icon: '📖' },
    { path: '/profile', label: '我的', icon: '👤' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      {tabs.map(tab => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`flex flex-col items-center relative ${
            location.pathname === tab.path ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-xs">{tab.label}</span>
          {tab.path === '/wrong-answers' && wrongAnswers.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {wrongAnswers.length > 9 ? '9+' : wrongAnswers.length}
            </span>
          )}
        </Link>
      ))}
    </nav>
  )
}
