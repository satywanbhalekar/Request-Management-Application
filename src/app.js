const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const authRoutes = require("./routes/authRoutes")
const requestRoutes = require("./routes/requestRoutes")
const errorHandler = require("./middleware/errorHandler")
const AppError = require("./utils/AppError")

const app = express()

// Security middleware
app.use(helmet())
app.use(cors())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
})
app.use("/api", limiter)

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



// API routes
app.use("/api/auth", authRoutes)
app.use("/api/requests", requestRoutes)

// 404 handler
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404))
})

// Global error handler
app.use(errorHandler)

module.exports = app
