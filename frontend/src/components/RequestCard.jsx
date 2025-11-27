"use client"

import { useState } from "react"
import { approveRequest, rejectRequest, closeRequest, getRequestActions } from "../api/client"
import { showToast } from "../utils/toast"
import "../styles/components.css"

export default function RequestCard({ request, currentUser, onRefresh }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [actions, setActions] = useState([])

  const canApprove = currentUser?.role === "manager" && request.status === "pending"
  const canReject = currentUser?.role === "manager" && request.status === "pending"
  const canClose = currentUser?.id === request.assigned_to && request.status === "approved"

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      await approveRequest(request.id, notes)
      showToast("Request approved", "success")
      setNotes("")
      setShowNotes(false)
      onRefresh()
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to approve request"
      showToast(errorMsg, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      await rejectRequest(request.id, notes)
      showToast("Request rejected", "success")
      setNotes("")
      setShowNotes(false)
      onRefresh()
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to reject request"
      showToast(errorMsg, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = async () => {
    setIsLoading(true)
    try {
      await closeRequest(request.id, notes)
      showToast("Request closed", "success")
      setNotes("")
      setShowNotes(false)
      onRefresh()
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to close request"
      showToast(errorMsg, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewHistory = async () => {
    try {
      const actionHistory = await getRequestActions(request.id)
      setActions(actionHistory)
      setShowHistory(true)
    } catch (error) {
      showToast("Failed to load request history", "error")
    }
  }

  const getStatusClass = (status) => {
    return `status-${status?.toLowerCase() || "pending"}`
  }

  return (
    <div className="request-card">
      <div className="card-header">
        <h3 className="card-title">{request.title}</h3>
        <span className={`status-badge ${getStatusClass(request.status)}`}>{request.status}</span>
      </div>

      <p className="card-description">{request.description}</p>

      <div className="card-meta">
        <span className="meta-item">Created By: {request.creator?.full_name || "Unknown"}</span>
        <span className="meta-item">Assigned To: {request.assignee?.full_name || "Unknown"}</span>
        <span className="meta-item">Created: {new Date(request.created_at).toLocaleDateString()}</span>
      </div>

      <div className="card-actions">
        {canApprove && !showNotes && (
          <button className="btn btn-approve" onClick={() => setShowNotes(true)}>
            Approve
          </button>
        )}
        {canReject && !showNotes && (
          <button className="btn btn-reject" onClick={() => setShowNotes(true)}>
            Reject
          </button>
        )}
        {canClose && !showNotes && (
          <button className="btn btn-close" onClick={() => setShowNotes(true)}>
            Close
          </button>
        )}
        <button className="btn btn-history" onClick={handleViewHistory}>
          View History
        </button>
      </div>

      {showNotes && (
        <div className="notes-section">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add optional notes..."
            className="notes-input"
            rows="3"
          />
          <div className="notes-actions">
            {canApprove && (
              <button className="btn btn-approve" onClick={handleApprove} disabled={isLoading}>
                {isLoading ? "Processing..." : "Confirm Approve"}
              </button>
            )}
            {canReject && (
              <button className="btn btn-reject" onClick={handleReject} disabled={isLoading}>
                {isLoading ? "Processing..." : "Confirm Reject"}
              </button>
            )}
            {canClose && (
              <button className="btn btn-close" onClick={handleClose} disabled={isLoading}>
                {isLoading ? "Processing..." : "Confirm Close"}
              </button>
            )}
            <button
              className="btn btn-cancel"
              onClick={() => {
                setShowNotes(false)
                setNotes("")
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="history-modal">
          <div className="history-header">
            <h4>Request History</h4>
            <button className="close-btn" onClick={() => setShowHistory(false)}>
              ×
            </button>
          </div>
          <div className="history-list">
            {actions.length === 0 ? (
              <p>No actions recorded</p>
            ) : (
              actions.map((action) => (
                <div key={action.id} className="history-item">
                  <span className="action-type">{action.action_type}</span>
                  <span className="action-performer">{action.performer?.full_name}</span>
                  <span className="action-date">{new Date(action.created_at).toLocaleString()}</span>
                  {action.notes && <p className="action-notes">{action.notes}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
