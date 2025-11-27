"use client"

import "../styles/components.css"

export default function DashboardHeader({ user, onLogout }) {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="logo">Request Manager</h1>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.full_name || user?.fullName || user?.email}</span>
            <span className="user-role">{user?.role || "Employee"}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
