const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const employeeRepository = require("../repositories/employeeRepository")
const AppError = require("../utils/AppError")
const logger = require("../config/logger")

class AuthService {
  async register(employeeData) {
    const existing = await employeeRepository.findByEmail(employeeData.email)
    if (existing) {
      throw new AppError("Email already registered", 400)
    }

    const hashedPassword = await bcrypt.hash(employeeData.password, 10)

    const employee = await employeeRepository.create({
      email: employeeData.email,
      password_hash: hashedPassword,
      full_name: employeeData.fullName,
      role: employeeData.role || "employee",
      manager_id: employeeData.managerId || null,
    })

    logger.info("Employee registered", { employeeId: employee.id })

    const token = this.generateToken(employee.id)
    return { employee: this.sanitizeEmployee(employee), token }
  }

  async login(email, password) {
    const employee = await employeeRepository.findByEmail(email)
    if (!employee) {
      throw new AppError("Invalid credentials", 401)
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password_hash)
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401)
    }

    logger.info("Employee logged in", { employeeId: employee.id })

    const token = this.generateToken(employee.id)
    return { employee: this.sanitizeEmployee(employee), token }
  }

  generateToken(employeeId) {
    return jwt.sign({ id: employeeId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    })
  }

  sanitizeEmployee(employee) {
    const { password_hash, ...sanitized } = employee
    return sanitized
  }
}

module.exports = new AuthService()
