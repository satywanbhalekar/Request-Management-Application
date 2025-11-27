const express = require("express")
const authController = require("../controllers/authController")
const { authenticateToken } = require("../middleware/auth")
const { validate, schemas } = require("../middleware/validation")

const router = express.Router()

router.post("/register", validate(schemas.register), authController.register)
router.post("/login", validate(schemas.login), authController.login)
router.get("/me", authenticateToken, authController.getCurrentUser)

module.exports = router
