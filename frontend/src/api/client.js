import axios from "axios"
import Cookies from "js-cookie"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function loginUser(email, password) {
  const response = await apiClient.post("/auth/login", { email, password })
  const { data } = response.data
  Cookies.set("auth_token", data.token, { expires: 7 })
  return { token: data.token, employee: data.employee }
}

export async function signupUser(email, password, fullName, role = "employee", managerId = null) {
  const response = await apiClient.post("/auth/register", {
    email,
    password,
    fullName,
    role,
    managerId,
  })
  const { data } = response.data
  Cookies.set("auth_token", data.token, { expires: 7 })
  return { token: data.token, employee: data.employee }
}

export async function getCurrentUser() {
  const response = await apiClient.get("/auth/me")
  return response.data.data.employee
}

export async function logoutUser() {
  Cookies.remove("auth_token")
}

export async function getRequests(filters = {}) {
  const response = await apiClient.get("/requests", { params: filters })
  return response.data.data.requests
}

export async function createRequest(title, description, assignedTo) {
  const response = await apiClient.post("/requests", {
    title,
    description,
    assignedTo,
  })
  return response.data.data.request
}

export async function approveRequest(id, notes = "") {
  const response = await apiClient.post(`/requests/${id}/approve`, { notes })
  return response.data.data.request
}

export async function rejectRequest(id, notes = "") {
  const response = await apiClient.post(`/requests/${id}/reject`, { notes })
  return response.data.data.request
}

export async function closeRequest(id, notes = "") {
  const response = await apiClient.post(`/requests/${id}/close`, { notes })
  return response.data.data.request
}

export async function getRequestActions(id) {
  const response = await apiClient.get(`/requests/${id}/actions`)
  return response.data.data.actions
}

export async function getRequestById(id) {
  const response = await apiClient.get(`/requests/${id}`)
  return response.data.data.request
}

// Get all employees for dropdown
export const getEmployees = async () => {
  const response = await apiClient.get('/requests/employees') // or '/requests/employees' based on your backend
  return response.data
}
