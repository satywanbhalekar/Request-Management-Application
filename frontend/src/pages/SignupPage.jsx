"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authStore } from "../store/authStore"
import { signupUser } from "../api/client"
import { showToast } from "../utils/toast"
import "../styles/auth.css"

export default function SignupPage() {
  const navigate = useNavigate()
  const setAuth = authStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
    managerId: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // Pass parameters individually
      const response = await signupUser(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role,
        formData.role === "employee" ? formData.managerId || undefined : undefined
      )
      
      setAuth(response.employee, response.token)
      showToast("Account created successfully!", "success")
      navigate("/dashboard")
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Signup failed"
      setError(errorMsg)
      showToast(errorMsg, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join our request management system</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="form-input"
            />
          </div>

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
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} className="form-input">
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {formData.role === "employee" && (
            <div className="form-group">
              <label htmlFor="managerId" className="form-label">
                Manager ID <span style={{ color: "#666" }}>(optional)</span>
              </label>
              <input
                id="managerId"
                type="text"
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
                placeholder="Enter your manager's ID"
                className="form-input"
              />
            </div>
          )}

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
              minLength={6}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <a href="/login" className="auth-link">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}
