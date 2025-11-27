import { create } from "zustand"
import Cookies from "js-cookie"

export const authStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (employee, token) => {
    set({ user: employee, token, isAuthenticated: true })
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
