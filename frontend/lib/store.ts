import { create } from "zustand"
import Cookies from "js-cookie"

interface User {
  id: string
  email: string
  fullName: string
  role: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  loadFromCookie: () => void
}

export const authStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    set({ user, token, isAuthenticated: true })
    Cookies.set("auth_token", token, { expires: 7 })
  },
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false })
    Cookies.remove("auth_token")
  },
  loadFromCookie: () => {
    const token = Cookies.get("auth_token")
    if (token) {
      set({ token, isAuthenticated: true })
    }
  },
}))
