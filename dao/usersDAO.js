import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let users;

export default class UsersDAO {
    //* DB connection
    static async injectDB(conn) {
        if (users) {
            return;
        }
        try {
            users = await conn.db(process.env.ATLAS_NS).collection("users");
        } catch (e) {
            console.error(
                `Unable to establish a collection hande in usersDAO: ${e}`,
            );
        }
    }

    //* Specific search methods
    static async getUserByUsername(username) {
        try {
            const pipeline = [
                {
                    $match: {
                        username: username,
                        deleted: false
                    }
                },
            ];
            return await users.aggregate(pipeline).next();
        } catch (e) {
            console.error(`Something went wrong in getUserByUsername: ${e}`);
            throw e;
        }
    }

    //* CRUD METHODS
    static async getAllUsers ({
        filters = null,
        page = 0,
        usersPerPage = 20,
    } = {}) {

        //Customize DB searches
        let query = {deleted: {$eq: false}};
        if (filters) {
            if ("username" in filters) {
                query = {$text: { $search: filters["username"]}, deleted: {$eq: false}};
            } else if ("role" in filters) {
                query = {role: { $eq: filters["role"]}, deleted: {$eq: false}};
            } else if ("company" in filters){
                query = {company: { $eq: filters["company"]}, deleted: {$eq: false}};
            }
        }

        let cursor

        try {
            cursor = await users
                .find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return {usersList: [], totalNumUsers: 0};
        }

        const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page);

        try {
            const usersList = await displayCursor.toArray();
            const totalNumUsers = page === 0 ? await users.countDocuments(query) : 0;
            return {usersList, totalNumUsers}
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return {usersList: [], totalNumUsers: 0};
        }
    }
    
    static async addUser(userDoc)
    {    
        try {
            return await users.insertOne(userDoc);
        } catch (error) {
            console.error(`Unable to post user: ${e}`);
            return { error: e };
        }
    }

    static async updateUser(userDoc)
        {
        try {
            const updateResponse = await users.updateOne(
                {email:userDoc.email, password: userDoc.password, deleted: false},
                {$set: {
                    username: userDoc.username,
                    role: userDoc.role,
                    company: userDoc.company,
                    updatedAt: userDoc.updatedAt
                }}
            )
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update user: ${e}`);
            return { error: e };
        }
    }

    //soft deletion
    static async deleteUser(userDoc)
        {
        try {
            const deleteResponse = await users.updateOne(
                {email: userDoc.email, password: userDoc.password, deleted: false},
                {$set:{
                deleted: true
                }}
            )

            return deleteResponse
        } catch (error) {
            console.error(`Unable to delete user: ${e}`);
            return { error: e };
        }
    }

    
    //* miscellaneous
    static async checkEmailExistence(email) {
        try {
            const pipeline = [
                {
                    $match: {
                        email: email,
                    }
                },
            ];
            
            return await users.aggregate(pipeline).next();
        } catch (e) {
            console.error(`Something went wrong in checkEmailExistence: ${e}`);
            throw e;
        }
    }
}


