const authService = require("../services/authService")


class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body)
      res.status(201).json({
        status: "success",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const result = await authService.login(email, password)

      res.status(200).json({
        status: "success",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      res.status(200).json({
        status: "success",
        data: { employee: authService.sanitizeEmployee(req.user) },
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AuthController()
