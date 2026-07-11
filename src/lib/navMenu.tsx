import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type NavMenuContextValue = {
  menuOpen: boolean
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
}

const NavMenuContext = createContext<NavMenuContextValue | null>(null)

export function NavMenuProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), [])

  return (
    <NavMenuContext.Provider value={{ menuOpen, openMenu, closeMenu, toggleMenu }}>
      {children}
    </NavMenuContext.Provider>
  )
}

export function useNavMenu() {
  const ctx = useContext(NavMenuContext)
  if (!ctx) throw new Error('useNavMenu requires NavMenuProvider')
  return ctx
}
