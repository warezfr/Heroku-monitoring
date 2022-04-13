import Joi from "joi";

export default class Schemas {
    
    static userSchema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{8,30}$/).required(),
        role: Joi.string().valid('developer','administrator','user').insensitive(),
        company: Joi.string().required(),
        deleted: Joi.boolean(),
        createdAt: Joi.string().allow(''),
        updatedAt: Joi.string().allow(''),
    })

    static deleteUserSchema = Joi.object({
        email: Joi.string().email(),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{8,30}$/),
    })

    static companySchema = Joi.object({
        company_id: Joi.number().integer().greater(999999).less(9999999),
        name: Joi.string().required(),
        location: Joi.array().ordered(
            Joi.number().min(-90).max(90).required(),
            Joi.number().min(-180).max(180).required()
        ),
        razon_social: Joi.string().allow(''),
        deleted: Joi.boolean(),
        createdAt: Joi.string().allow(''),
        updatedAt: Joi.string().allow(''),
    })

    static deleteCompanySchema = Joi.object({
        name: Joi.string().required(),
        razon_social: Joi.string().allow('').required(),

    })

    static deviceSchema = Joi.object({
        device_id: Joi.number().integer().greater(999999).less(9999999),
        description: Joi.string().allow(''),
        company_id: Joi.number().integer().greater(999999).less(9999999).required(),
        alert: Joi.boolean().required(),
        alert_message: Joi.string().allow(''),
        max_value: Joi.string().alphanum().required(),
        min_value: Joi.string().alphanum().required(),
        deleted: Joi.boolean(),
        createdAt: Joi.string().allow(''),
        updatedAt: Joi.string().allow(''),
    })

    static deleteDeviceSchema = Joi.object({
        device_id: Joi.number().integer().greater(999999).less(9999999).required(),
        company_id: Joi.number().integer().greater(999999).less(9999999).required(),
    })

    static recordSchema = Joi.object({
        time_stamp: Joi.date().timestamp().required(),
        device_id: Joi.number().integer().greater(999999).less(9999999).required(),
        value: Joi.number().integer(),
        deleted: Joi.boolean(),
        createdAt: Joi.string().allow(''),
        updatedAt: Joi.string().allow(''),
    })

    static deleteRecordSchema = Joi.object({
        start_date: Joi.date().timestamp().required(),
        end_date: Joi.date().timestamp().required(),
        device_id: Joi.number().integer().greater(999999).less(9999999).required(),
    })
}