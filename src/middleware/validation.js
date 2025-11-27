const Joi = require("joi")
const AppError = require("../utils/AppError")

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      const errors = error.details.map((detail) => detail.message)
      return next(new AppError(errors.join(", "), 400))
    }

    next()
  }
}

// Validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().required(),
    role: Joi.string().valid("employee", "manager").default("employee"),
    managerId: Joi.string().uuid().optional().allow(null, '') // Allow optional/null/empty
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  createRequest: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    assignedTo: Joi.string().uuid().required(),
  }),

  approveReject: Joi.object({
    notes: Joi.string().optional(),
  }),

  closeRequest: Joi.object({
    notes: Joi.string().optional(),
  }),
}

module.exports = { validate, schemas }
