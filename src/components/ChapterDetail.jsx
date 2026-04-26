import { motion } from 'framer-motion'
import { ArrowLeft, Book, CheckCircle, Sparkles, ChevronDown, ChevronRight, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'

const ChapterDetail = ({ chapter, onBack }) => {
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const toggleSubsection = (sectionIndex, subsectionIndex) => {
    setExpandedSections(prev => ({
      ...prev,
      [`${sectionIndex}-${subsectionIndex}`]: !prev[`${sectionIndex}-${subsectionIndex}`]
    }))
  }

  return (
    <section className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mb-8 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Chapters
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Chapter Image */}
          {chapter.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8 rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={chapter.imageUrl}
                alt={chapter.name}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </motion.div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl">
                <Book className="text-white" size={32} />
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full">
                  Chapter {chapter.id}
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {chapter.name}
            </h1>
            <p className="text-xl text-orange-600 dark:text-orange-400 mb-4 font-medium">
              {chapter.sanskrit}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 italic mb-6">
              {chapter.english}
            </p>

            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Sparkles className="text-orange-500" size={20} />
                <span className="text-gray-700 dark:text-gray-300 font-medium">{chapter.verses} Verses</span>
              </div>
              <div className="flex items-center gap-2">
                <Book className="text-orange-500" size={20} />
                <span className="text-gray-700 dark:text-gray-300 font-medium">{chapter.theme}</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Summary
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {chapter.summary}
              </p>
            </div>

            {/* Acronym Section */}
            {chapter.acronym && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Chapter Acronym: {chapter.acronym}
                </h2>
                <p className="text-lg text-orange-600 dark:text-orange-400 mb-6 italic">
                  {chapter.acronymMeaning}
                </p>

                <div className="space-y-4">
                  {chapter.acronymSections.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSection(index)}
                        className="w-full p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-between hover:from-orange-100 hover:to-amber-100 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 dark:text-white">{section.title}</span>
                        {expandedSections[index] ? (
                          <ChevronDown className="text-orange-600 dark:text-orange-400" size={20} />
                        ) : (
                          <ChevronRight className="text-orange-600 dark:text-orange-400" size={20} />
                        )}
                      </button>

                      {expandedSections[index] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 bg-white dark:bg-gray-800"
                        >
                          <p className="text-gray-600 dark:text-gray-400 mb-4">{section.content}</p>
                          
                          {section.subsections && section.subsections.length > 0 && (
                            <div className="space-y-2">
                              {section.subsections.map((subsection, subIndex) => (
                                <div key={subIndex} className="border-l-2 border-orange-300 dark:border-orange-700 pl-4">
                                  <button
                                    onClick={() => toggleSubsection(index, subIndex)}
                                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
                                  >
                                    {expandedSections[`${index}-${subIndex}`] ? (
                                      <ChevronDown size={16} />
                                    ) : (
                                      <ChevronRight size={16} />
                                    )}
                                    {subsection}
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Key Teachings
              </h2>
              <ul className="space-y-3">
                {chapter.keyTeachings.map((teaching, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="text-orange-500 mt-1 flex-shrink-0" size={20} />
                    <span className="text-gray-600 dark:text-gray-400">{teaching}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 p-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-white shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Sparkles size={24} />
              Study Tip
            </h3>
            <p className="text-orange-100">
              Read this chapter slowly and reflect on how its teachings apply to your life. Consider journaling your thoughts and insights. Use the acronym sections to deepen your understanding of each concept.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ChapterDetail
