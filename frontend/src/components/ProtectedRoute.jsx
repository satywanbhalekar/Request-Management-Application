import { Navigate } from "react-router-dom"
import { authStore } from "../store/authStore"

export default function ProtectedRoute({ children }) {
  const isAuthenticated = authStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}
