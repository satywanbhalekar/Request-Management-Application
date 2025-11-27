"use client"

import { useRouter } from "next/navigation"
import { authStore } from "@/lib/store"
import { logoutUser } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function DashboardHeader() {
  const router = useRouter()
  const user = authStore((state) => state.user)
  const logout = authStore((state) => state.logout)

  const handleLogout = () => {
    logoutUser()
    logout()
    toast.success("Logged out successfully")
    router.push("/login")
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Request Manager</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, <span className="font-semibold">{user?.fullName}</span>
          </span>
          <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 bg-transparent">
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
