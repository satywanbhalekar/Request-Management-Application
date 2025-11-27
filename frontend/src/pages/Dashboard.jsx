"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authStore } from "../store/authStore"
import { getRequests, getCurrentUser } from "../api/client"
import { showToast } from "../utils/toast"
import DashboardHeader from "../components/DashboardHeader"
import RequestsList from "../components/RequestsList"
import CreateRequestModal from "../components/CreateRequestModal"
import "../styles/dashboard.css"

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = authStore()
  const [currentUser, setCurrentUser] = useState(null)
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [userData, requestsData] = await Promise.all([getCurrentUser(), getRequests()])
      setCurrentUser(userData)
      setRequests(requestsData || [])
    } catch (error) {
      showToast("Failed to load dashboard data", "error")
      // If auth fails, redirect to login
      if (error.response?.status === 401) {
        logout()
        navigate("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    showToast("Logged out successfully", "success")
    navigate("/login")
  }

  const handleRequestCreated = () => {
    setShowModal(false)
    loadDashboardData()
  }

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true
    return req.status === filter
  })

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader user={currentUser} onLogout={handleLogout} />

      <div className="dashboard-content">
        <div className="dashboard-header-section">
          <h1 className="page-title">My Requests</h1>
          <button className="create-btn" onClick={() => setShowModal(true)}>
            + New Request
          </button>
        </div>

        <div className="filter-section">
          <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            All Requests
          </button>
          <button className={`filter-btn ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>
            Pending
          </button>
          <button
            className={`filter-btn ${filter === "approved" ? "active" : ""}`}
            onClick={() => setFilter("approved")}
          >
            Approved
          </button>
          <button
            className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </button>
          <button className={`filter-btn ${filter === "closed" ? "active" : ""}`} onClick={() => setFilter("closed")}>
            Closed
          </button>
        </div>

        <RequestsList requests={filteredRequests} currentUser={currentUser} onRefresh={loadDashboardData} />
      </div>

      {showModal && <CreateRequestModal onClose={() => setShowModal(false)} onSuccess={handleRequestCreated} />}
    </div>
  )
}
