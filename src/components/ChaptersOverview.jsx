import { motion } from 'framer-motion'
import { chaptersData } from '../data/chaptersData'
import { Search, Book, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'

const ChaptersOverview = ({ onSelectChapter }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredChapters = chaptersData.filter(chapter =>
    chapter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                        <span className="text-sm font-bold text-orange-700 dark:text-orange-300">
                          {chapter.acronym}
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
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ChaptersOverview
