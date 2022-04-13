import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let devices;

export default class DevicesDAO {
    //* DB connection
    static async injectDB(conn) {
        if (devices) {
            return;
        }
        try {
            devices = await conn.db(process.env.ATLAS_NS).collection("devices");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in devicesDAO: ${e}`,
            );
        }
    }

    //* Specified search methods
    static async getRecordsByDevice(deviceInfo)
        {
        try {
            const recordsPipeline= [
                    {
                        $match: {
                            deleted: false,
                            $expr: { $eq: ["$$device_iden", "$device_id"] },
                            time_stamp: {
                                $gte: deviceInfo.start_date,
                                $lte: deviceInfo.end_date
                            } 
                        },
                    },
                    {
                        $sort: {
                            time_stamp: -1,
                        },
                    }, {
                        $project: {
                            _id: 0,
                            time_stamp: 1, //{ $dateToString: { format: "%d-%m-%Y %H:%M:%S", date: "$time_stamp", timezone: "America/Ensenada"}},
                            value: 1,
                            record_id: 1
                        }
                    }
            ];
            const devicePipeline = [
                {
                    $match: {
                        device_id: deviceInfo.device_id,
                        deleted: false
                    },
                }, 
                {
                    $lookup: {
                        from: "records",
                        let: {
                            device_iden: "$device_id",
                        },
                        pipeline: recordsPipeline,
                        as: "records",
                    },
                },
                {
                    $addFields: {
                        records: "$records"
                    }
                }, {
                    $project: {
                        _id:0,
                        description:1,
                        records:1
                    }
                }
            ];
            return await devices.aggregate(devicePipeline).next();
            //return updateResponse;
        } catch (e) {
            console.error(`Unable to get records from device: ${e}`);
            return { error: e };
        }
    }

    //* CRUD METHODS
    static async getAllDevices ({
        filters = null,
        page = 0,
        devicesPerPage = 20,
    } = {}) {

        //Customize DB searches
        let query = {deleted: {$eq: false}};
        if (filters) {
            if ("description" in filters) {
                query = {$text: { $search: filters["description"]}, deleted: {$eq: false}};
            } else if ("device_id" in filters) {
                query = {device_id: { $eq: parseInt(filters["device_id"])}, deleted: {$eq: false}};
            } else if ("company_id" in filters) {
                query = {company_id: { $eq: parseInt(filters["company_id"])}, deleted: {$eq: false}};
            } 
        }

        let cursor;

        try {
            cursor = await devices.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return {devicesList: [], totalNumDevices: 0};
        }

        const displayCursor = cursor.limit(devicesPerPage).skip(devicesPerPage * page);

        try {
            const devicesList = await displayCursor.toArray()
            const totalNumDevices = page === 0 ? await devices.countDocuments(query) : 0;
            return {devicesList, totalNumDevices}
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return {devicesList: [], totalNumDevices: 0};
        }
    }

    static async addDevice(deviceDoc)
        {    
            try {
                return await devices.insertOne(deviceDoc);
            } catch (error) {
                console.error(`Unable to post device: ${e}`);
                return { error: e };
            }
        }
    
    static async updateDevice(deviceDoc)
        {
        try {                
            const updateResponse = await devices.updateOne(
                {device_id:deviceDoc.device_id, company_id: deviceDoc.company_id, deleted: false},
                {$set: {
                    description: deviceDoc.description,
                    alert: deviceDoc.alert,
                    alert_message: deviceDoc.alert_message,
                    max_value: deviceDoc.max_value,
                    min_value: deviceDoc.min_value,
                    updatedAt: deviceDoc.updatedAt,
                }}
            )
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update device: ${e}`);
            return { error: e };
        }
    }

    //soft deletion
    static async deleteDevice(deviceDoc)
        {
        try {
            const deleteResponse = await devices.updateOne(
                {device_id:deviceDoc.device_id, company_id: deviceDoc.company_id, deleted: false},
                {$set:{
                    deleted: true
                }}
            )
            return deleteResponse
        } catch (error) {
            console.error(`Unable to delete device: ${e}`);
            return { error: e };
        }
    }

    static async getDeviceID() {
        try {
            const testResponse = await devices.findOneAndUpdate(
                { "_id": "UNIQUE COUNT DOCUMENT IDENTIFIER" },
                { $inc: { "count": 1 }}
            )
            return testResponse
        } catch (e) {
            console.error(`Unable to delete device: ${e}`);
            return { error: e };
        }
    }

    //* miscellaneous
    static async checkDeviceExistence(device_id) {
        try {
            const pipeline = [
                {
                    $match: {
                        device_id: device_id,
                        deleted: false
                    }
                },
            ];
            return await devices.aggregate(pipeline).next();
        } catch (e) {
            console.error(`Something went wrong in checkDeviceExistence: ${e}`);
            throw e;
        }
    }
}


