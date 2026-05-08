import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { VocabProvider } from './context/VocabContext'
import { BottomNav } from './components/layout/BottomNav'
import { HomePage } from './pages/HomePage'
import { ProgressPage } from './pages/ProgressPage'
import { LibraryPage } from './pages/LibraryPage'
import { ProfilePage } from './pages/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VocabProvider>
          <div className="pb-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
          <BottomNav />
        </VocabProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App