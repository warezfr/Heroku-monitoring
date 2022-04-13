import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let companies;

export default class CompaniesDAO {
    //* DB connection
    static async injectDB(conn) {
        if (companies) {
            return;
        }
        try {
            companies = await conn.db(process.env.ATLAS_NS).collection("companies");
        } catch (e) {
            console.error(
                `Unable to establish a collection hande in companiesDAO: ${e}`,
            );
        }
    }

    //* Specified search methods
    static async getDevicesAndRecordByCompany(name)
        {
        try {

            /* 
               Match: Gets documents of the records collection that are not deleted and are joined with devices collection by device_id.
               Sort: Sorted by time_stamped in descending order (Newest to oldest records). 
            */
            const recordPipeline = [
                {
                    $match: {
                        deleted: false,
                        $expr: { $eq: ["$$parentDevice_id", "$device_id"], },
                    },
                }, {
                    $sort: { time_stamp: -1, },
                }, {
                    $limit: 1
                }
            ];

            /*
              Match: Gets documents of the devices collection that are not deleted and are joined with company collection by company_id.
              Lookup: Does Left Outer Join with documents returned from the recordPipeline with device_id field.
              Sort: Sorted by device_id in descending order (Newest to oldest registered devices). 
              AddFields: adds joined documents in a new "records" field.
            */
            const devicePipeline = [
                {
                    $match: {
                        deleted: false,
                        $expr: { $eq: ["$$company_iden", "$company_id"], },
                    },
                }, {
                    $lookup: {
                        from: "records",
                        let: {parentDevice_id: "$device_id",},
                        pipeline: recordPipeline,
                        as: "records",
                    }
                }, { $addFields: { value: {$first: "$records.value"}} }, {
                    $sort: { device_id: 1, },
                },
            ];
            /*
              Match: Gets documents of the company collection that that have an specific given name and are not deleted.
              Lookup: Does Left Outer Join with documents returned from the devicePipeline with company_id field.
              Sort: Sorted by device_id in descending order (Newest to oldest registered devices). 
              AddFields: adds joined documents in a new "device" field.
            */
            const companyPipeline = [
                { $match: { name: name, deleted: false }, }, 
                {
                    $lookup: {
                        from: "devices",
                        let: { company_iden: "$company_id", },
                        pipeline: devicePipeline,
                        as: "devices",
                    },
                }, { $addFields: { devices: "$devices" } },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        location: 1,
                        company_id:1,
                        devices: {
                            description: 1,
                            alert: 1,
                            alert_message: 1,
                            max_value: 1,
                            min_value: 1,
                            device_id: 1,
                            value:1
                        }
                    }
                }
            ];

            return await companies.aggregate(companyPipeline).next();
        } catch (e) {
            console.error(`Unable to update company: ${e}`);
            return { error: e };
        }
    }
    
    static async getUsersByCompany(name)
        {
        try {
            
            const userPipeline = [
                {
                    $match: {
                        deleted: false,
                        $expr: {
                            $eq: ["$$company_name", "$company"],
                        },
                    },
                }, {
                    $sort: {
                        company: -1,
                    },
                },
            ];

            const companyPipeline = [
                {
                    $match: { name: name, deleted: false },
                }, {
                    $lookup: {
                        from: "users",
                        let: {
                            company_name: "$name",
                        },
                        pipeline: userPipeline,
                        as: "users",
                    },
                }, { $addFields: { users: "$users" } }
            ];
            return await companies.aggregate(companyPipeline).next();
        } catch (e) {
            console.error(`Unable to update company: ${e}`);
            return { error: e };
        }
    }

    static async getDevicesByCompany(name)
        {
        try {
            const devicePipeline = [
                {
                    $match: {
                        deleted: false,
                        $expr: { $eq: ["$$company_iden", "$company_id"], },
                    },
                }, {
                    $sort: { device_id: -1, },
                },
            ];
            const companyPipeline = [
                { $match: { name: name, deleted: false }, }, 
                {
                    $lookup: {
                        from: "devices",
                        let: { company_iden: "$company_id", },
                        pipeline: devicePipeline,
                        as: "devices",
                    },
                },
                { $addFields: { devices: "$devices" } }
            ];

            return await companies.aggregate(companyPipeline).next();
        } catch (e) {
            console.error(`Unable to update company: ${e}`);
            return { error: e };
        }
    }

    //* CRUD METHODS
    static async getAllCompanies ({
        filters = null,
        page = 0,
        companiesPerPage = 20,
    } = {}) {

        //Customize DB searches
        let query = {deleted: {$eq: false}};
        if (filters) {
            if ("name" in filters) {
                query = {$text: { $search: filters["name"]}, deleted: {$eq: false}};
            } else if ("location" in filters) {
                query = {location: { $eq: filters["location"]}, deleted: {$eq: false}};
            } else if ("razon_social" in filters){
                query = {razon_social: { $eq: filters["razon_social"]}, deleted: {$eq: false}};
            }
        }

        let cursor

        try {
            cursor = await companies.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return {companiesList: [], totalNumCompanies: 0};
        }

        const displayCursor = cursor.limit(companiesPerPage).skip(companiesPerPage * page);

        try {
            const companiesList = await displayCursor.toArray()
            const totalNumCompanies = page === 0 ? await companies.countDocuments(query) : 0;
            return {companiesList, totalNumCompanies}
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return {companiesList: [], totalNumCompanies: 0};
        }
    }

    static async addCompany(companyDoc)
        {    
            try {
                return await companies.insertOne(companyDoc);
            } catch (error) {
                console.error(`Unable to post company: ${e}`);
                return { error: e };
            }
        }
    
    static async updateCompany(companyDoc)
        {
        try {                
            const updateResponse = await companies.updateOne(
                {company:companyDoc.name, deleted: false},
                {$set: {
                    location: companyDoc.location,
                    razon_social: companyDoc.razon_social,
                    updatedAt: companyDoc.updatedAt
                }}
            )
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update company: ${e}`);
            return { error: e };
        }
    }

    //soft deletion
    static async deleteCompany(companyDoc)
        {
        try {
            const deleteResponse = await companies.updateOne(
                {name:companyDoc.name, razon_social:companyDoc.razon_social, deleted: false},
                {$set:{
                deleted: true
                }}
            )
            return deleteResponse
        } catch (error) {
            console.error(`Unable to delete company: ${e}`);
            return { error: e };
        }
    }

    static async getCompanyID() {
        try {
            const testResponse = await companies.findOneAndUpdate(
                { "_id": "UNIQUE COUNT DOCUMENT IDENTIFIER" },
                { $inc: { "count": 1 }}
            )
            return testResponse
        } catch (e) {
            console.error(`Unable to delete company: ${e}`);
            return { error: e };
        }
    }

    //* miscellaneous
    static async checkCompanyExistence(name) {
        try {
            const pipeline = [
                {
                    $match: {
                        name: name,
                        deleted: false
                    }
                },
            ];
            return await companies.aggregate(pipeline).next();
        } catch (e) {
            console.error(`Something went wrong in checkCompanyExistence: ${e}`);
            throw e;
        }
    }
}


