import { create } from 'zustand'
import Cookies from 'js-cookie'

type SidebarState = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggle: () => void
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  isOpen: Cookies.get('sidebar_state') !== 'false',
  setIsOpen: (open) => {
    Cookies.set('sidebar_state', String(open), { expires: 30 })
    set({ isOpen: open })
  },
  toggle: () =>
    set((state) => {
      const newState = !state.isOpen
      Cookies.set('sidebar_state', String(newState), { expires: 30 })
      return { isOpen: newState }
    }),
}))
