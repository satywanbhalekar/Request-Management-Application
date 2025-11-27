import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600">Request Manager</h1>
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
          </Link>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center px-4">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">Manage Your Requests Efficiently</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          A simple and powerful request management system to track, approve, and manage all your requests in one place.
        </p>
        <div className="space-x-4">
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">Get Started</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
