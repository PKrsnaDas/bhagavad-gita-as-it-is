import { motion } from 'framer-motion'
import { ArrowLeft, Book, CheckCircle, ChevronDown, ChevronRight, Plus, Sparkles, Trash2 } from 'lucide-react'
import { Fragment, lazy, Suspense, useState } from 'react'
import { useEditMode } from '../context/EditModeContext'
import { useChapterContent } from '../hooks/useChapterContent'
import InlineEdit from './InlineEdit'
import ChapterNotes from './ChapterNotes'

const ChapterFlowchart = lazy(() => import('./ChapterFlowchart'))

const ChapterDetail = ({ chapter, onBack, user }) => {
  const [expandedSections, setExpandedSections] = useState({})
  const { isEditMode } = useEditMode()
  const { content, updateField } = useChapterContent(chapter)

  const acronymColors = [
    'text-red-500 dark:text-red-400',
    'text-amber-500 dark:text-amber-400',
    'text-emerald-500 dark:text-emerald-400',
    'text-sky-500 dark:text-sky-400',
    'text-violet-500 dark:text-violet-400',
    'text-pink-500 dark:text-pink-400',
  ]

  const toggleSection = (index) => {
    if (isEditMode) return
    setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const renderColoredAcronym = (acronym) => {
    const syllables = acronym.split('.').filter(Boolean)
    return (
      <span className="inline-flex flex-wrap items-center gap-1">
        {syllables.map((syllable, index) => (
          <span key={`${syllable}-${index}`} className={`font-bold ${acronymColors[index % acronymColors.length]}`}>
            {syllable}
            {index < syllables.length - 1 && <span className="text-gray-500 dark:text-gray-400">.</span>}
          </span>
        ))}
      </span>
    )
  }

  const flowSteps = (content.acronymSections || []).map((section, index) => {
    const [head, ...rest] = section.title.split(' - ')
    return { id: `${head}-${index}`, letter: head, label: rest.join(' - ') || head, description: section.content }
  })

  /* ── Key teachings helpers ─────────────────────────────────── */
  const updateTeaching = (i, val) => {
    const arr = [...content.keyTeachings]
    arr[i] = val
    updateField('keyTeachings', arr)
  }
  const deleteTeaching = (i) => updateField('keyTeachings', content.keyTeachings.filter((_, j) => j !== i))
  const addTeaching = () => updateField('keyTeachings', [...content.keyTeachings, 'New teaching'])

  /* ── Acronym section helpers ───────────────────────────────── */
  const updateSection = (i, field, val) => {
    const arr = (content.acronymSections || []).map((s, j) => j === i ? { ...s, [field]: val } : s)
    updateField('acronymSections', arr)
  }

  return (
    <section className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Edit mode banner */}
        {isEditMode && (
          <div className="mb-4 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-sm font-medium flex items-center gap-2">
            ✏️ Edit mode is ON — click any text to edit it. Changes save automatically.
          </div>
        )}

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
              <img src={chapter.imageUrl} alt={chapter.name} className="w-full h-64 sm:h-80 object-cover" />
            </motion.div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl">
                <Book className="text-white" size={32} />
              </div>
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full">
                Chapter {chapter.id}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              <InlineEdit value={content.name} onSave={v => updateField('name', v)} />
            </h1>
            <p className="text-xl text-orange-600 dark:text-orange-400 mb-4 font-medium">
              <InlineEdit value={content.sanskrit} onSave={v => updateField('sanskrit', v)} />
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 italic mb-6">
              <InlineEdit value={content.english} onSave={v => updateField('english', v)} />
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Sparkles className="text-orange-500" size={20} />
                <span className="text-gray-700 dark:text-gray-300 font-medium">{content.verses} Verses</span>
              </div>
              <div className="flex items-center gap-2">
                <Book className="text-orange-500" size={20} />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  <InlineEdit value={content.theme} onSave={v => updateField('theme', v)} />
                </span>
              </div>
            </div>

            {/* Connection with Previous Chapter */}
            {content.connectionWithPreviousChapter && (
              <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Connection with Previous Chapter
                </h2>
                <div className="text-gray-700 dark:text-gray-300">
                  <InlineEdit value={content.connectionWithPreviousChapter} onSave={v => updateField('connectionWithPreviousChapter', v)} multiline />
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Summary</h2>
              <div className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                <InlineEdit value={content.summary} onSave={v => updateField('summary', v)} multiline />
              </div>
            </div>

            {/* Acronym Section */}
            {content.acronym && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Chapter Acronym:</h2>
                <div className="text-3xl mb-4">{renderColoredAcronym(content.acronym)}</div>
                <p className="text-lg text-orange-600 dark:text-orange-400 mb-6 italic">
                  <InlineEdit value={content.acronymMeaning} onSave={v => updateField('acronymMeaning', v)} />
                </p>

                <div className="space-y-4">
                  {(content.acronymSections || []).map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                    >
                      {isEditMode ? (
                        /* Edit mode: static header, all expanded */
                        <div className="w-full p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 flex items-center gap-2">
                          <span className={`${acronymColors[index % acronymColors.length]} font-bold text-sm`}>
                            {section.title.split(' - ')[0]}
                          </span>
                          <span className="text-gray-400"> - </span>
                          <InlineEdit
                            value={section.title.includes(' - ') ? section.title.split(' - ').slice(1).join(' - ') : section.title}
                            onSave={v => {
                              const prefix = section.title.split(' - ')[0]
                              updateSection(index, 'title', `${prefix} - ${v}`)
                            }}
                            className="flex-1 font-semibold text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                      ) : (
                        /* View mode: collapsible button */
                        <button
                          onClick={() => toggleSection(index)}
                          className="w-full p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-between hover:from-orange-100 hover:to-amber-100 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 dark:text-white text-left">
                            <span className={`${acronymColors[index % acronymColors.length]} font-bold`}>
                              {section.title.split(' - ')[0]}
                            </span>
                            {section.title.includes(' - ') ? ` - ${section.title.split(' - ').slice(1).join(' - ')}` : ''}
                          </span>
                          {expandedSections[index]
                            ? <ChevronDown className="text-orange-600 dark:text-orange-400 flex-shrink-0" size={20} />
                            : <ChevronRight className="text-orange-600 dark:text-orange-400 flex-shrink-0" size={20} />}
                        </button>
                      )}

                      {(isEditMode || expandedSections[index]) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-4 bg-white dark:bg-gray-800"
                        >
                          <div className="text-gray-600 dark:text-gray-400 mb-4">
                            <InlineEdit
                              value={section.content}
                              onSave={v => updateSection(index, 'content', v)}
                              multiline
                            />
                          </div>
                          {section.subsections && section.subsections.length > 0 && (
                            <div className="space-y-2">
                              {section.subsections.map((subsection, subIndex) => (
                                <div key={subIndex} className="border-l-2 border-orange-300 dark:border-orange-700 pl-4 text-gray-700 dark:text-gray-300 font-medium text-sm">
                                  {subsection}
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

            {/* Concept Flow Diagram */}
            {flowSteps.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Concept Flow Diagram</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">Visual sequence of this chapter&apos;s core teaching progression.</p>

                <div className="sm:hidden space-y-2">
                  {flowSteps.map((step, index) => (
                    <Fragment key={`${step.id}-mobile`}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.08 }}
                        className="p-4 rounded-xl border border-orange-200 dark:border-gray-600 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 shadow-sm"
                      >
                        <p className="text-xs uppercase tracking-wide text-orange-700 dark:text-orange-300 mb-2">Step {index + 1}</p>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                          <span className={`${acronymColors[index % acronymColors.length]} font-bold`}>{step.letter}</span>
                          <span className="text-gray-500 dark:text-gray-400"> - </span>
                          {step.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{step.description}</p>
                      </motion.div>
                      {index < flowSteps.length - 1 && (
                        <div className="flex justify-center text-orange-500 dark:text-orange-400 text-lg font-bold" aria-hidden="true">↓</div>
                      )}
                    </Fragment>
                  ))}
                </div>

                <div className="hidden sm:block overflow-x-auto pb-2">
                  <div className="min-w-max flex items-center gap-3">
                    {flowSteps.map((step, index) => (
                      <Fragment key={`${step.id}-desktop`}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: index * 0.08 }}
                          className="w-64 p-4 rounded-xl border border-orange-200 dark:border-gray-600 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 shadow-sm"
                        >
                          <p className="text-xs uppercase tracking-wide text-orange-700 dark:text-orange-300 mb-2">Step {index + 1}</p>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                            <span className={`${acronymColors[index % acronymColors.length]} font-bold`}>{step.letter}</span>
                            <span className="text-gray-500 dark:text-gray-400"> - </span>
                            {step.label}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{step.description}</p>
                        </motion.div>
                        {index < flowSteps.length - 1 && (
                          <div className="text-orange-500 dark:text-orange-400 text-xl font-bold px-1" aria-hidden="true">→</div>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Key Teachings */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Key Teachings</h2>
              <ul className="space-y-3">
                {content.keyTeachings.map((teaching, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="text-orange-500 mt-1 flex-shrink-0" size={20} />
                    <span className="text-gray-600 dark:text-gray-400 flex-1">
                      <InlineEdit value={teaching} onSave={v => updateTeaching(index, v)} />
                    </span>
                    {isEditMode && (
                      <button
                        onClick={() => deleteTeaching(index)}
                        className="text-red-400 hover:text-red-600 flex-shrink-0 mt-0.5 transition-colors"
                        title="Delete teaching"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </motion.li>
                ))}
              </ul>
              {isEditMode && (
                <button
                  onClick={addTeaching}
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-sm font-medium transition-all"
                >
                  <Plus size={16} /> Add Teaching
                </button>
              )}
            </div>

            {/* Flowchart */}
            <Suspense fallback={<div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">Loading flowchart…</div>}>
              <ChapterFlowchart chapter={chapter} />
            </Suspense>

            <ChapterNotes chapterId={chapter.id} user={user} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ChapterDetail
