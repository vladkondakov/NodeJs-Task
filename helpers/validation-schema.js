const Joi = require('joi')

const employeeSchema = Joi.object().keys({
    name: Joi.string().pattern(/^[a-zA-z]+$/).min(1).max(100).required(),
    surname: Joi.string().alphanum().min(1).max(100).required(),
    dateOfBirth: Joi.date().greater('1-1-1940').iso().required(),
    position: Joi.array().valid('Junior Software Engineer', 'Software Engineer', 'Junior Backend Developer').required(),
    salary: Joi.number().min(0).required()
})

const authSchema = Joi.object().keys({
    login: Joi.string().pattern(/^\w+$/).required(),
    password: Joi.string().pattern(/^\w+$/).min(3).max(16).required()
})

module.exports = {
    employeeSchema,
    authSchema
}