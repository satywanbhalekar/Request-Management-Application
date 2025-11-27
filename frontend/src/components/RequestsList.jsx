import RequestCard from "./RequestCard"
import "../styles/components.css"

export default function RequestsList({ requests, currentUser, onRefresh }) {
  if (requests.length === 0) {
    return (
      <div className="empty-state">
        <p>No requests found. Create one to get started!</p>
      </div>
    )
  }

  return (
    <div className="requests-grid">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} currentUser={currentUser} onRefresh={onRefresh} />
      ))}
    </div>
  )
}
