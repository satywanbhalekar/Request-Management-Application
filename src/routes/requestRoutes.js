const express = require("express")
const requestController = require("../controllers/requestController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")
const { validate, schemas } = require("../middleware/validation")

const router = express.Router()

router.use(authenticateToken)

router.post("/", validate(schemas.createRequest), requestController.createRequest)
// In your routes file (e.g., employeeRoutes.js or requestRoutes.js)
router.get('/employees', requestController.getAllEmployees)
router.get("/", requestController.getRequests)
router.get("/:id", requestController.getRequestById)
router.get("/:id/actions", requestController.getRequestActions)

router.post("/:id/approve",authorizeRoles("manager"),validate(schemas.approveReject),requestController.approveRequest,)
router.post("/:id/reject", authorizeRoles("manager"), validate(schemas.approveReject), requestController.rejectRequest)
router.post("/:id/close", validate(schemas.closeRequest), requestController.closeRequest)


module.exports = router
