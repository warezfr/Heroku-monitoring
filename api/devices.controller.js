import Joi from "joi";
import DevicesDAO from "../dao/devicesDAO.js";
import Schemas from "../schemas/joi.schemas.js";

export default class DevicesController {

    // * CRUD methods
    //Gets all non deleted companies with optional filters from query parameters
    static async apiGetDevices (req,res,next) {
        try {
            const devicesPerPage = req.query.devicesPerPage ? parseInt(req.query.devicesPerPage, 10) : 20;
            const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    
            let filters = {};
            if (req.query.device_id) {
                filters.device_id = req.query.device_id;
            } else if (req.query.company_id) {
                filters.company_id = req.query.company_id;
            } else if (req.query.description) {
                filters.description = req.query.description;
            }
    
            const {devicesList, totalNumDevices} = await DevicesDAO.getAllDevices( {
                filters,
                page,
                devicesPerPage
            });
    
            let response = {
                devices: devicesList,
                page: page,
                filters: filters,
                entries_per_page: devicesPerPage,
                total_results: totalNumDevices,
            }
            res.json(response)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //Registers a new company to the database
    static async apiPostDevices (req,res,next) {
        try {
            /*
            let device = await DevicesDAO.checkDeviceExistence(req.body.device_id);

            if(device) {
                res.status(400).json({ error: "Device already exists"})
                return;
            }
            */
            const DeviceInfo = {
                description: req.body.description,
                company_id: req.body.company,
                alert: req.body.alert,
                alert_message: req.body.alert_message,
                max_value: req.body.max_value,
                min_value: req.body.min_value,
                deleted: false
            }

            Joi.assert(DeviceInfo,Schemas.deviceSchema);
            const DeviceID = await DevicesDAO.getDeviceID();

            DeviceInfo.device_id = DeviceID.value.count;
            DeviceInfo.createdAt = new Date();
            DeviceInfo.updatedAt = new Date();
            const deviceResponse = await DevicesDAO.addDevice(
                DeviceInfo
            )
            res.json({ status:"success"})

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //Updates a company found by email and password
    static async apiUpdateDevices (req,res,next) {
        try {         
            const deviceInfo = {
                device_id: req.body.device_id,
                description: req.body.description,
                company_id: req.body.company,
                alert: req.body.alert,
                alert_message: req.body.alert_message,
                max_value: req.body.max_value,
                min_value: req.body.min_value,
            }

            Joi.assert(deviceInfo,Schemas.deviceSchema);
            deviceInfo.updatedAt = new Date();

            const DeviceResponse = await DevicesDAO.updateDevice(
                deviceInfo
            )
            var { error } = DeviceResponse;
            if (error) {
                res.status(400).json({ error });
            }
            if (DeviceResponse.matchedCount == 0) {
                res.status(400).json({ error: "Company not found with provided name" });
            } else {
                res.json({ status:"success"})
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //Soft deletes a company found by email and password
    static async apiDeleteDevices (req,res,next) {
        try {
            const deviceInfo = {
                device_id: req.body.device_id,
                company_id: req.body.company,
            }
            Joi.assert(deviceInfo,Schemas.deleteDeviceSchema);

            const DeviceResponse = await DevicesDAO.deleteDevice(
                deviceInfo
            )

            if (DeviceResponse.matchedCount == 0) {
                res.status(400).json({ error: "Device not found with device_id and company_id provided" });
            } else {
                res.json({ status:"success"})
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }


    //* Specific methods
    //Gets devices in company
    static async apiGetRecordsByDevice(req,res,next) {
        try {
            const deviceInfo = {
                start_date: new Date(req.body.start_date),
                end_date: new Date(req.body.end_date),
                device_id: req.body.device_id,
            }
            let device = await DevicesDAO.getRecordsByDevice(deviceInfo);
            if(!device) {
                res.status(400).json({ error: "Could not find device records with given info"})
                return;
            }
            res.json(device);
        } catch (e) {
            console.log(`api ${e}`);
            res.status(500).json({ error: e });
        }
    }

    //Generates company ID
    static async apiGetID(req,res,next) {
        try {
            const DeviceResponse = await DevicesDAO.getDeviceID();
            res.json(DeviceResponse)
        } catch (e) {
            console.log(`api ${e}`);
            res.status(500).json({ error: e });
        }
    }
}