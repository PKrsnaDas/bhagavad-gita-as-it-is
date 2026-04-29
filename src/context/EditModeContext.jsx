import { createContext, useContext, useState } from 'react'

const EditModeContext = createContext({
  isEditMode: false,
  unlock: () => false,
  lock: () => {},
})

export const EditModeProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false)

  const unlock = (password) => {
    const stored = import.meta.env.VITE_EDIT_PASSWORD || ''
    if (!stored || password === stored) {
      setIsEditMode(true)
      return true
    }
    return false
  }

  const lock = () => setIsEditMode(false)

  return (
    <EditModeContext.Provider value={{ isEditMode, unlock, lock }}>
      {children}
    </EditModeContext.Provider>
  )
}

export const useEditMode = () => useContext(EditModeContext)
