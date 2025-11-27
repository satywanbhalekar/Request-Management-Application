"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authStore } from "@/lib/store"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RequestsList } from "@/components/dashboard/requests-list"
import { CreateRequestDialog } from "@/components/dashboard/create-request-dialog"

export default function DashboardPage() {
  const router = useRouter()
  const user = authStore((state) => state.user)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
          <CreateRequestDialog />
        </div>
        <RequestsList />
      </main>
    </div>
  )
}
