import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(https://png.pngtree.com/background/20250416/original/pngtree-lord-krishna-arjuna-5-horses-bhagavad-gita-battlefield-of-kurukshetra-background-picture-image_16432522.jpg)' }}>
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg">
              <BookOpen className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
            Bhagavad Gita As It Is
          </h1>
          <p className="text-xl sm:text-2xl text-white mb-8 drop-shadow-2xl font-semibold">
            The Song of God
          </p>
          <p className="text-lg text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-2xl">
            A 700-verse Hindu scripture that is part of the epic Mahabharata. This study guide is based on "Bhagavad Gita As It Is" by HDG A.C. Bhaktivedanta Swami Prabhupada, presenting the dialogue between Prince Arjuna and Lord Krishna with authoritative commentary from the Gaudiya Vaishnava tradition.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#chapters"
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Explore Chapters <ArrowRight size={20} />
            </a>
            <div className="flex items-center gap-2 text-white font-semibold">
              <Sparkles size={20} className="text-orange-400" />
              <span>18 Chapters • 700 Verses</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="p-4 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg backdrop-blur-sm">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">18</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Chapters</div>
            </div>
            <div className="p-4 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg backdrop-blur-sm">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">700</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Verses</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
