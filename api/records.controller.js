import Joi from "joi";
import { ObjectId } from "mongodb";
import RecordsDAO from "../dao/recordsDAO.js";
import Schemas from "../schemas/joi.schemas.js";

export default class RecordsController {

    // * CRUD methods
    //Gets all non deleted companies with optional filters from query parameters
    static async apiGetRecords (req,res,next) {
        try {
            const recordsPerPage = req.query.recordsPerPage ? parseInt(req.query.recordsPerPage, 10) : 20;
            const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    
            let filters = {};
            if (req.query.device_id) {
                filters.device_id = req.query.device_id;
            }

            const {recordsList, totalNumRecords} = await RecordsDAO.getAllRecords( {
                filters,
                page,
                recordsPerPage
            });
    
            let response = {
                records: recordsList,
                page: page,
                filters: filters,
                entries_per_page: recordsPerPage,
                total_results: totalNumRecords,
            }
            res.json(response)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //Registers a new company to the database
    static async apiPostRecords (req,res,next) {
        try {
            const RecordInfo = {
                time_stamp: new Date(),
                device_id: req.body.device_id,
                value: req.body.value,
                deleted: false
            }

            Joi.assert(RecordInfo,Schemas.recordSchema);
            const RecordID = await RecordsDAO.getRecordID();
            RecordInfo.record_id = RecordID.value.count;
            RecordInfo.createdAt = new Date();
            RecordInfo.updatedAt = new Date();
            const recordResponse = await RecordsDAO.addRecord(
                RecordInfo
            )
            res.json({ status:"success"})

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiAddTestRecords (req,res,next) {
        try {

            let records = [];
            let count = 1000000

            for (let i = 0; i < 86400; i++) {
                records.push({
                    _id: new ObjectId(),
                    time_stamp: new Date(),
                    device_id: req.body.device_id,
                    value:Math.floor(Math.random() * (120 - 70)) + 70 ,
                    deleted: false,
                    record_id: count++,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            }

            const recordResponse = await RecordsDAO.addTestDummies(
                records
            );

            res.json({ status:"success"});

        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteAllRecords (req,res,next) {
        try {
            const recordInfo = {
                start_date: new Date(req.body.start_date),
                end_date: new Date(req.body.end_date),
                device_id: req.body.device_id,
            }

            const RecordResponse = await RecordsDAO.deleteAllRecords();

            if (RecordResponse.matchedCount == 0) {
                res.status(400).json({ error: "Device not found with device_id and company_id provided" });
            } else {
                res.json({ status:"success"})
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //Soft deletes a company found by email and password
    static async apiDeleteRecords (req,res,next) {
        try {
            const recordInfo = {
                start_date: new Date(req.body.start_date),
                end_date: new Date(req.body.end_date),
                device_id: req.body.device_id,
            }
            Joi.assert(recordInfo,Schemas.deleteRecordSchema);

            const RecordResponse = await RecordsDAO.deleteRecords(
                recordInfo
            )

            if (RecordResponse.matchedCount == 0) {
                res.status(400).json({ error: "Device not found with device_id and company_id provided" });
            } else {
                res.json({ status:"success"})
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //* Specific methods
}