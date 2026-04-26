import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ChaptersOverview from './components/ChaptersOverview'
import ChapterFlowGraph from './components/ChapterFlowGraph'
import ChapterDetail from './components/ChapterDetail'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import { supabase, isSupabaseConfigured } from './lib/supabaseClient'

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
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          onOpenAuth={() => setAuthOpen(true)}
          onLogout={handleLogout}
        />
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
        <Footer />
      </div>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

export default App
