import { useAuth } from '../hooks/useAuth'
import { AuthForm } from '../components/auth/AuthForm'

export function ProfilePage() {
  const { user, signOut } = useAuth()

  if (!user) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">词汇学习</h1>
        <AuthForm />
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">我的</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <p className="font-bold text-lg">{user.email}</p>
            <p className="text-gray-500 text-sm">已登录</p>
          </div>
        </div>
      </div>

      <button
        onClick={signOut}
        className="w-full py-3 bg-red-50 text-red-600 rounded-xl"
      >
        退出登录
      </button>
    </div>
  )
}
