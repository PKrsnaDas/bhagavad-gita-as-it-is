import { useState } from 'react'
import { Menu, X, Moon, Sun, BookOpen, Lock, Pencil } from 'lucide-react'
import { useEditMode } from '../context/EditModeContext'

const Navbar = ({ darkMode, setDarkMode, user, onOpenAuth, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showPwModal, setShowPwModal] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')
  const { isEditMode, unlock, lock } = useEditMode()

  const handleUnlock = () => {
    if (unlock(pw)) { setShowPwModal(false); setPw(''); setPwError('') }
    else setPwError('Incorrect password.')
  }

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Chapters', href: '#chapters' },
    { name: 'Flow', href: '#flow' },
  ]

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-orange-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <a href="#home" className="text-xl font-bold text-gray-900 dark:text-white">
              Bhagavad Gita
            </a>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-orange-100 dark:bg-gray-800 text-orange-700 dark:text-gray-300 hover:bg-orange-200 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isEditMode ? (
                <button
                  onClick={lock}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors"
                >
                  <Pencil size={14} /> Edit ON
                </button>
              ) : (
                <button
                  onClick={() => setShowPwModal(true)}
                  className="p-2 rounded-lg bg-orange-100 dark:bg-gray-800 text-orange-700 dark:text-gray-300 hover:bg-orange-200 dark:hover:bg-gray-700 transition-colors"
                  title="Unlock editing"
                >
                  <Lock size={18} />
                </button>
              )}

              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300 max-w-[160px] truncate">
                    {user.email}
                  </span>
                  <button
                    onClick={onLogout}
                    className="px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-gray-800 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-gray-700 text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-gray-800 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-gray-700 text-sm"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-orange-100 dark:bg-gray-800 text-orange-700 dark:text-gray-300"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {isEditMode ? (
              <button onClick={lock} className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                <Pencil size={18} />
              </button>
            ) : (
              <button onClick={() => setShowPwModal(true)} className="p-2 rounded-lg bg-orange-100 dark:bg-gray-800 text-orange-700 dark:text-gray-300">
                <Lock size={18} />
              </button>
            )}
            {user ? (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-gray-800 text-orange-700 dark:text-orange-300 text-sm"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-gray-800 text-orange-700 dark:text-orange-300 text-sm"
              >
                Login
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-800"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-orange-200 dark:border-gray-800">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>

      {showPwModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Lock size={18} className="text-orange-500" /> Unlock Editing
              </h3>
              <button onClick={() => { setShowPwModal(false); setPw(''); setPwError('') }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Enter your password to edit chapter content, flowcharts, and more.
            </p>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setPwError('') }}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              placeholder="Edit password…"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-orange-500 transition-colors mb-2 text-sm"
            />
            {pwError && <p className="text-sm text-red-500 mb-3">{pwError}</p>}
            <button
              onClick={handleUnlock}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold transition-all shadow-md mt-1"
            >
              Unlock
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
