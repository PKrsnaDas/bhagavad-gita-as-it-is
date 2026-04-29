import { motion } from 'framer-motion'
import { chaptersData } from '../data/chaptersData'
import { Search, Book, Image as ImageIcon, Plus } from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useEditMode } from '../context/EditModeContext'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const AddChapterModal = lazy(() => import('./editor/AddChapterModal'))

const ChaptersOverview = ({ onSelectChapter }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [customChapters, setCustomChapters] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const { isEditMode } = useEditMode()

  useEffect(() => {
    const load = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from('custom_chapters').select('*').order('created_at')
        if (data) {
          setCustomChapters(data.map(d => ({
            ...d, id: `custom-${d.id}`, dbId: d.id, custom: true,
            imageUrl: null, verses: 0, keyTeachings: [], acronymSections: [],
          })))
          return
        }
      }
      const raw = localStorage.getItem('custom_chapters')
      if (raw) setCustomChapters(JSON.parse(raw))
    }
    load()
  }, [])
  const acronymColors = [
    'text-red-500 dark:text-red-400',
    'text-amber-500 dark:text-amber-400',
    'text-emerald-500 dark:text-emerald-400',
    'text-sky-500 dark:text-sky-400',
    'text-violet-500 dark:text-violet-400',
    'text-pink-500 dark:text-pink-400'
  ]

  const renderColoredAcronym = (acronym) => {
    const syllables = acronym.split('.').filter(Boolean)

    return (
      <span className="inline-flex flex-wrap items-center gap-0.5">
        {syllables.map((syllable, index) => (
          <span key={`${syllable}-${index}`} className={`font-bold ${acronymColors[index % acronymColors.length]}`}>
            {syllable}
            {index < syllables.length - 1 && <span className="text-gray-500 dark:text-gray-400">.</span>}
          </span>
        ))}
      </span>
    )
  }

  const allChapters = [...chaptersData, ...customChapters]
  const filteredChapters = allChapters.filter(chapter =>
    chapter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chapter.english || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chapter.theme || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.acronym?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section id="chapters" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            The 18 Chapters
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Explore each chapter of the Bhagavad Gita systematically, with detailed summaries, acronyms for easy memorization, key teachings, and themes.
          </p>

          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search chapters by name, theme, or acronym..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                onClick={() => onSelectChapter(chapter)}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 group"
              >
                {chapter.imageUrl && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={chapter.imageUrl}
                      alt={chapter.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl">
                      <Book className="text-white" size={24} />
                    </div>
                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                      {chapter.verses} Verses
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                      Chapter {chapter.id}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {chapter.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {chapter.sanskrit}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-3">
                      {chapter.english}
                    </p>
                    {chapter.acronym && (
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-full">
                        <span className="text-sm">
                          {renderColoredAcronym(chapter.acronym)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Theme: {chapter.theme}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* + New Chapter card — edit mode only */}
            {isEditMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setShowAddModal(true)}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-dashed border-orange-300 dark:border-orange-700 hover:border-orange-500 group flex flex-col items-center justify-center min-h-[200px] p-8"
              >
                <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="text-orange-500" size={28} />
                </div>
                <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">New Chapter</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 text-center">Create a custom chapter with full content editing</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {showAddModal && (
        <Suspense fallback={null}>
          <AddChapterModal
            onClose={() => setShowAddModal(false)}
            onCreated={(ch) => setCustomChapters(prev => [...prev, ch])}
          />
        </Suspense>
      )}
    </section>
  )
}

export default ChaptersOverview
