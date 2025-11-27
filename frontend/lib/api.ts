import axios from "axios"
import Cookies from "js-cookie"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Authentication
export async function loginUser(email: string, password: string) {
  const response = await apiClient.post("/auth/login", { email, password })
  const { token, user } = response.data
  Cookies.set("auth_token", token, { expires: 7 })
  return { token, user }
}

export async function signupUser(email: string, password: string, fullName: string) {
  const response = await apiClient.post("/auth/signup", {
    email,
    password,
    fullName,
  })
  return response.data
}

export async function logoutUser() {
  Cookies.remove("auth_token")
}

// Requests
export async function getRequests() {
  const response = await apiClient.get("/requests")
  return response.data
}

export async function createRequest(data: {
  title: string
  description: string
  type: string
}) {
  const response = await apiClient.post("/requests", data)
  return response.data
}

export async function updateRequest(id: string, data: any) {
  const response = await apiClient.put(`/requests/${id}`, data)
  return response.data
}

export async function approveRequest(id: string) {
  const response = await apiClient.post(`/requests/${id}/approve`)
  return response.data
}

export async function rejectRequest(id: string, reason: string) {
  const response = await apiClient.post(`/requests/${id}/reject`, { reason })
  return response.data
}
