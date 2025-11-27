require("dotenv").config()
const app = require("./app")
const logger = require("./config/logger")

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully")
  server.close(() => {
    logger.info("Process terminated")
  })
})

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection", { error: err.message, stack: err.stack })
  server.close(() => {
    process.exit(1)
  })
})
