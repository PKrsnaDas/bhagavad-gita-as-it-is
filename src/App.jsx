import { lazy, Suspense, useEffect, useState } from 'react'
import { EditModeProvider } from './context/EditModeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ChaptersOverview from './components/ChaptersOverview'
import ChapterFlowGraph from './components/ChapterFlowGraph'
import Footer from './components/Footer'
import { supabase, isSupabaseConfigured } from './lib/supabaseClient'

const ChapterDetail = lazy(() => import('./components/ChapterDetail'))
const AuthModal = lazy(() => import('./components/AuthModal'))

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [user, setUser] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return (
    <EditModeProvider>
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          onOpenAuth={() => setAuthOpen(true)}
          onLogout={handleLogout}
        />
        <Suspense
          fallback={
            <div className="px-4 sm:px-6 lg:px-8 py-16 text-center text-gray-600 dark:text-gray-400">
              Loading content...
            </div>
          }
        >
          {selectedChapter ? (
            <ChapterDetail
              chapter={selectedChapter}
              onBack={() => setSelectedChapter(null)}
              user={user}
            />
          ) : (
            <>
              <Hero />
              <ChaptersOverview onSelectChapter={setSelectedChapter} />
              <ChapterFlowGraph />
            </>
          )}
        </Suspense>
        <Footer />
      </div>
      <Suspense fallback={null}>
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </Suspense>
    </div>
    </EditModeProvider>
  )
}

export default App
