import { useState } from 'react'
import { Menu, X, Moon, Sun, BookOpen } from 'lucide-react'

const Navbar = ({ darkMode, setDarkMode, user, onOpenAuth, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Chapters', href: '#chapters' },
    { name: 'Flow', href: '#flow' },
  ]

  return (
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
  )
}

export default Navbar
