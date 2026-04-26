import { motion } from 'framer-motion'
import { chaptersData } from '../data/chaptersData'

const ChapterFlowGraph = () => {
  const chapters = chaptersData

  return (
    <section id="flow" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Chapter Flow & Connections
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Visual journey through the 18 chapters of Bhagavad Gita, showing how each chapter builds upon the previous one and leads to the ultimate goal of liberation.
          </p>

          <div className="relative">
            {/* Flow line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-500 via-amber-500 to-orange-300 hidden lg:block"></div>

            <div className="space-y-8">
              {chapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} lg:flex-row`}
                >
                  {/* Left side content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'} lg:text-right`}>
                    <div className={`bg-gradient-to-br ${index % 2 === 0 ? 'from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800' : 'from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700'} p-6 rounded-2xl shadow-lg border border-orange-200 dark:border-gray-700`}>
                      <span className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-2 block">
                        Chapter {chapter.id}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {chapter.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {chapter.acronym}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                        {chapter.theme}
                      </p>
                    </div>
                  </div>

                  {/* Center node */}
                  <div className="relative z-10 hidden lg:block">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">{chapter.id}</span>
                    </div>
                  </div>

                  {/* Right side content - empty for alternating layout */}
                  <div className="flex-1 hidden lg:block"></div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile view - vertical timeline */}
          <div className="lg:hidden mt-8 space-y-4">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold">{chapter.id}</span>
                </div>
                <div className="flex-1 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-orange-200 dark:border-gray-700">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-1 block">
                    {chapter.name}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {chapter.acronym} • {chapter.theme}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 p-6 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Chapter Flow Guide</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <span className="font-bold text-orange-600 dark:text-orange-400">Chapters 1-6:</span>
                <p className="mt-1">Foundation - Understanding the self, action, and meditation</p>
              </div>
              <div>
                <span className="font-bold text-orange-600 dark:text-orange-400">Chapters 7-12:</span>
                <p className="mt-1">Devotion - Knowing God, His glories, and the path of love</p>
              </div>
              <div>
                <span className="font-bold text-orange-600 dark:text-orange-400">Chapters 13-18:</span>
                <p className="mt-1">Liberation - Nature, qualities, and ultimate freedom</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ChapterFlowGraph
