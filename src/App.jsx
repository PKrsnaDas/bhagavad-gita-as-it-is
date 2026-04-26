import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ChaptersOverview from './components/ChaptersOverview'
import ChapterFlowGraph from './components/ChapterFlowGraph'
import ChapterDetail from './components/ChapterDetail'
import Footer from './components/Footer'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [selectedChapter, setSelectedChapter] = useState(null)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        {selectedChapter ? (
          <ChapterDetail chapter={selectedChapter} onBack={() => setSelectedChapter(null)} />
        ) : (
          <>
            <Hero />
            <ChaptersOverview onSelectChapter={setSelectedChapter} />
            <ChapterFlowGraph />
          </>
        )}
        <Footer />
      </div>
    </div>
  )
}

export default App
