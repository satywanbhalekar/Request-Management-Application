const requestRepository = require("../repositories/requestRepository")
const employeeRepository = require("../repositories/employeeRepository")
const actionRepository = require("../repositories/actionRepository")
const AppError = require("../utils/AppError")
const logger = require("../config/logger")

class RequestService {
  async createRequest(creatorId, requestData) {
    const assignee = await employeeRepository.findById(requestData.assignedTo)
    if (!assignee) {
      throw new AppError("Assigned employee not found", 404)
    }

    const request = await requestRepository.create({
      title: requestData.title,
      description: requestData.description,
      created_by: creatorId,
      assigned_to: requestData.assignedTo,
      status: "pending",
    })

    await actionRepository.create({
      request_id: request.id,
      performed_by: creatorId,
      action_type: "created",
      notes: "Request created",
    })

    logger.info("Request created", { requestId: request.id, creatorId })

    return request
  }

  async getRequests(filters) {
    return await requestRepository.findAll(filters)
  }

  async getRequestById(requestId) {
    const request = await requestRepository.findById(requestId)
    if (!request) {
      throw new AppError("Request not found", 404)
    }
    return request
  }

  async approveRequest(requestId, managerId, notes) {
    const request = await requestRepository.findById(requestId)
    if (!request) {
      throw new AppError("Request not found", 404)
    }

    if (request.status !== "pending") {
      throw new AppError("Only pending requests can be approved", 400)
    }

    const assigneeManagerId = await employeeRepository.getManagerOfEmployee(request.assigned_to)

    if (assigneeManagerId !== managerId) {
      throw new AppError("Only the assigned employee's manager can approve this request", 403)
    }

    const updatedRequest = await requestRepository.update(requestId, {
      status: "approved",
      approved_by: managerId,
    })

    await actionRepository.create({
      request_id: requestId,
      performed_by: managerId,
      action_type: "approved",
      notes: notes || "Request approved",
    })

    logger.info("Request approved", { requestId, managerId })

    return updatedRequest
  }

  async rejectRequest(requestId, managerId, notes) {
    const request = await requestRepository.findById(requestId)
    if (!request) {
      throw new AppError("Request not found", 404)
    }

    if (request.status !== "pending") {
      throw new AppError("Only pending requests can be rejected", 400)
    }

    const assigneeManagerId = await employeeRepository.getManagerOfEmployee(request.assigned_to)

    if (assigneeManagerId !== managerId) {
      throw new AppError("Only the assigned employee's manager can reject this request", 403)
    }

    const updatedRequest = await requestRepository.update(requestId, {
      status: "rejected",
      approved_by: managerId,
    })

    await actionRepository.create({
      request_id: requestId,
      performed_by: managerId,
      action_type: "rejected",
      notes: notes || "Request rejected",
    })

    logger.info("Request rejected", { requestId, managerId })

    return updatedRequest
  }

  async closeRequest(requestId, employeeId, notes) {
    const request = await requestRepository.findById(requestId)
    if (!request) {
      throw new AppError("Request not found", 404)
    }

    if (request.assigned_to !== employeeId) {
      throw new AppError("Only the assigned employee can close this request", 403)
    }

    if (request.status !== "approved") {
      throw new AppError("Only approved requests can be closed", 400)
    }

    const updatedRequest = await requestRepository.update(requestId, {
      status: "closed",
      closed_at: new Date().toISOString(),
    })

    await actionRepository.create({
      request_id: requestId,
      performed_by: employeeId,
      action_type: "closed",
      notes: notes || "Request closed",
    })

    logger.info("Request closed", { requestId, employeeId })

    return updatedRequest
  }

  async getRequestActions(requestId) {
    const request = await requestRepository.findById(requestId)
    if (!request) {
      throw new AppError("Request not found", 404)
    }

    return await actionRepository.findByRequestId(requestId)
  }
}

module.exports = new RequestService()
