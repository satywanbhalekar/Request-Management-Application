const jwt = require("jsonwebtoken")
const AppError = require("../utils/AppError")
const employeeRepository = require("../repositories/employeeRepository")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      throw new AppError("Access token required", 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const employee = await employeeRepository.findById(decoded.id)

    if (!employee) {
      throw new AppError("User not found", 401)
    }

    req.user = employee
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401))
    }
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired", 401))
    }
    next(error)
  }
}

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403))
    }
    next()
  }
}

module.exports = { authenticateToken, authorizeRoles }
