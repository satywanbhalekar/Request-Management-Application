"use client"

import { useState, useEffect } from "react"
import { createRequest, getEmployees } from "../api/client"
import { showToast } from "../utils/toast"
import "../styles/components.css"

export default function CreateRequestModal({ onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false)
  const [employees, setEmployees] = useState([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "", // This will store the employee ID
  })
  const [error, setError] = useState("")

  // Fetch employees when component mounts
  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true)
      const response = await getEmployees()
      setEmployees(response.employees || response.data || response)
    } catch (error) {
      console.error("Failed to fetch employees:", error)
      showToast("Failed to load employees", "error")
      setEmployees([])
    } finally {
      setLoadingEmployees(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.assignedTo) {
      setError("Please select an employee to assign this request to")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await createRequest(formData.title, formData.description, formData.assignedTo)
      showToast("Request created successfully", "success")
      onSuccess()
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to create request"
      setError(errorMsg)
      showToast(errorMsg, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Request</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && (
          <div className="error-message" style={{ margin: "15px 20px 0" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Request Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter request title"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your request"
              rows="5"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assign To Employee</label>
            {loadingEmployees ? (
              <div className="form-input" style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                Loading employees...
              </div>
            ) : employees.length === 0 ? (
              <div className="form-input" style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                No employees available
              </div>
            ) : (
              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select an employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName || employee.name} - {employee.email}
                    {employee.role && ` (${employee.role})`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-submit" disabled={isLoading || loadingEmployees}>
              {isLoading ? "Creating..." : "Create Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
