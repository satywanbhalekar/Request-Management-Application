const requestService = require("../services/requestService")
const employeeRepository = require("../repositories/employeeRepository")

class RequestController {

  // In your controller
async getAllEmployees(req, res, next) {
  try {
    const employees = await employeeRepository.getAllEmployees()
    
    res.status(200).json({
      success: true,
      data: employees
    })
  } catch (error) {
    next(error)
  }
}


  async createRequest(req, res, next) {
    try {
      const request = await requestService.createRequest(req.user.id, req.body)
      res.status(201).json({
        status: "success",
        data: { request },
      })
    } catch (error) {
      next(error)
    }
  }

  async getRequests(req, res, next) {
    try {
      const filters = {}

      if (req.query.createdBy) filters.createdBy = req.query.createdBy
      if (req.query.assignedTo) filters.assignedTo = req.query.assignedTo
      if (req.query.status) filters.status = req.query.status

      const requests = await requestService.getRequests(filters)
      res.status(200).json({
        status: "success",
        results: requests.length,
        data: { requests },
      })
    } catch (error) {
      next(error)
    }
  }

  async getRequestById(req, res, next) {
    try {
      const request = await requestService.getRequestById(req.params.id)
      res.status(200).json({
        status: "success",
        data: { request },
      })
    } catch (error) {
      next(error)
    }
  }

  async approveRequest(req, res, next) {
    try {
      const request = await requestService.approveRequest(req.params.id, req.user.id, req.body.notes)
      res.status(200).json({
        status: "success",
        data: { request },
      })
    } catch (error) {
      next(error)
    }
  }

  async rejectRequest(req, res, next) {
    try {
      const request = await requestService.rejectRequest(req.params.id, req.user.id, req.body.notes)
      res.status(200).json({
        status: "success",
        data: { request },
      })
    } catch (error) {
      next(error)
    }
  }

  async closeRequest(req, res, next) {
    try {
      const request = await requestService.closeRequest(req.params.id, req.user.id, req.body.notes)
      res.status(200).json({
        status: "success",
        data: { request },
      })
    } catch (error) {
      next(error)
    }
  }

  async getRequestActions(req, res, next) {
    try {
      const actions = await requestService.getRequestActions(req.params.id)
      res.status(200).json({
        status: "success",
        results: actions.length,
        data: { actions },
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new RequestController()
