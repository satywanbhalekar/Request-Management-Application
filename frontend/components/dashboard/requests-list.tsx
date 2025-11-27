"use client"

import { useEffect, useState } from "react"
import { getRequests, approveRequest, rejectRequest } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Request {
  id: string
  title: string
  description: string
  status: string
  type: string
  createdAt: string
}

export function RequestsList() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const data = await getRequests()
      setRequests(data)
    } catch (error) {
      toast.error("Failed to load requests")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await approveRequest(id)
      toast.success("Request approved")
      loadRequests()
    } catch (error) {
      toast.error("Failed to approve request")
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectRequest(id, "Rejected")
      toast.success("Request rejected")
      loadRequests()
    } catch (error) {
      toast.error("Failed to reject request")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading requests...</div>
  }

  if (requests.length === 0) {
    return <div className="text-center py-8 text-gray-500">No requests found. Create one to get started!</div>
  }

  return (
    <div className="grid gap-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <CardTitle className="text-lg">{request.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{request.description}</p>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  Type: <span className="font-semibold">{request.type}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      request.status === "approved"
                        ? "text-green-600"
                        : request.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </p>
              </div>
              {request.status === "pending" && (
                <div className="space-x-2">
                  <Button
                    onClick={() => handleApprove(request.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve
                  </Button>
                  <Button onClick={() => handleReject(request.id)} className="bg-red-600 hover:bg-red-700 text-white">
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
