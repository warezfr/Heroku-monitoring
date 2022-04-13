import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let records;

export default class RecordsDAO {
    //* DB connection
    static async injectDB(conn) {
        if (records) {
            return;
        }
        try {
            records = await conn.db(process.env.ATLAS_NS).collection("records");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in recorsDAO: ${e}`,
            );
        }
    }

    //* Specified search methods

    //* CRUD METHODS
    static async getAllRecords ({
        filters = null,
        page = 0,
        recordsPerPage = 20,
    } = {}) {

        //Customize DB searches
        let query = {deleted: {$eq: false}};
        if (filters) {
            if ("device_id" in filters) {
                query = {device_id: { $eq: parseInt(filters["device_id"])}, deleted: {$eq: false}};
            }
        }

        let cursor;

        try {
            cursor = await records.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return {recordsList: [], totalNumRecords: 0};
        }

        const displayCursor = cursor.limit(recordsPerPage).skip(recordsPerPage * page);

        try {
            const recordsList = await displayCursor.toArray()
            const totalNumRecords = page === 0 ? await records.countDocuments(query) : 0;
            return {recordsList, totalNumRecords}
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return {recordsList: [], totalNumRecords: 0};
        }
    }

    static async addRecord(recordDoc)
        {    
            try {
                return await records.insertOne(recordDoc);
            } catch (e) {
                console.error(`Unable to post record: ${e}`);
                return { error: e };
            }
        }

    static async addTestDummies(recordDoc)
    {    
        try {
            return await records.insertMany(recordDoc);
        } catch (e) {
            console.error(`Unable to post record: ${e}`);
            return { error: e };
        }
    }

    static async deleteAllRecords()
    {    
        try {
            return await records.remove({});
        } catch (e) {
            console.error(`Unable to delete records: ${e}`);
            return { error: e };
        }
    }

    //soft deletion
    static async deleteRecords(recordDoc)
        {
        try {
            const deleteResponse = await records.updateMany(
                {device_id:recordDoc.device_id, time_stamp: { $gte: recordDoc.start_date, $lte: recordDoc.end_date}, deleted: false},
                {$set:{
                    deleted: true
                }}
            )
            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete record: ${e}`);
            return { error: e };
        }
    }

    //* miscellaneous
    static async getRecordID() {
        try {
            const testResponse = await records.findOneAndUpdate(
                { "_id": "UNIQUE COUNT DOCUMENT IDENTIFIER" },
                { $inc: { "count": 1 }}
            )
            return testResponse
        } catch (e) {
            console.error(`Unable to create record_ID: ${e}`);
            return { error: e };
        }
    }
}


