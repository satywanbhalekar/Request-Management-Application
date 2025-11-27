"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authStore } from "../store/authStore"
import { loginUser } from "../api/client"
import { showToast } from "../utils/toast"
import "../styles/auth.css"

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = authStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await loginUser(formData.email, formData.password)
      setAuth(response.employee, response.token)
      showToast("Login successful!", "success")
      navigate("/dashboard")
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Login failed"
      setError(errorMsg)
      showToast(errorMsg, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Employee Login</h1>
        <p className="auth-subtitle">Access your request management dashboard</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="employee@company.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <a href="/signup" className="auth-link">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
