export function showToast(message, type = "info") {
  console.log(`[Toast] ${type.toUpperCase()}: ${message}`)
  // In a real app, you'd integrate a toast library here
  // For now, this logs to console and alerts to user
  if (type === "error") {
    console.error(message)
  }
}
