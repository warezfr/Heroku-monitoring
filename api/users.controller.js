import Joi from "joi";
import UsersDAO from "../dao/usersDAO.js";
import Schemas from "../schemas/joi.schemas.js";

export default class UsersController {
    
    // * CRUD methods
    //Gets all non deleted users with optional filters from query parameters
    static async apiGetUsers (req,res,next) {
        try {
            const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20;
            const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    
            let filters = {};
            if (req.query.company) {
                filters.company = req.query.company;
            } else if (req.query.role) {
                filters.role = req.query.role;
            } else if (req.query.username){
                filters.username = req.query.username;
            }
    
            const {usersList, totalNumUsers} = await UsersDAO.getAllUsers( {
                filters,
                page,
                usersPerPage
            });
    
            let response = {
                users: usersList,
                page: page,
                filters: filters,
                entries_per_page: usersPerPage,
                total_results: totalNumUsers,
            }
            res.json(response)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    
    //Registers a new user to the database
    static async apiPostUsers (req,res,next) {
        try {
            let user = await UsersDAO.checkEmailExistence(req.body.email.toLowerCase());

            if(user) {
                if(user.deleted){
                    res.status(400).json({ error: "Email already exists with a deleted user"})
                } else {
                    res.status(400).json({ error: "Email already exists"})
                }
                return;
            }

            const userInfo = {
                username: req.body.username,
                email: req.body.email.toLowerCase(),
                password: req.body.password,
                role: req.body.role.toLowerCase(),
                company: req.body.company,
                deleted: false,
            }
            
            Joi.assert(userInfo,Schemas.userSchema);

            userInfo.createdAt = new Date();
            userInfo.updatedAt = new Date();

            const UserResponse = await UsersDAO.addUser(
                userInfo
            )
            res.json({ status:"success"})

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //Updates a user found by email and password
    static async apiUpdateUsers (req,res,next) {
        try {         
            const userInfo = {
                username: req.body.username,
                email: req.body.email.toLowerCase(),
                password: req.body.password,
                role: req.body.role.toLowerCase(),
                company: req.body.company,
            }
            
            Joi.assert(userInfo,Schemas.userSchema);
            userInfo.updatedAt = new Date();

            const UserResponse = await UsersDAO.updateUser(
                userInfo
            )

            var { error } = UserResponse;
            if (error) {
                res.status(400).json({ error });
            }
            if (UserResponse.matchedCount == 0) {
                res.status(400).json({ error: "User not found with email and password provided" });
            } else {
                res.json({ status:"success"})
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //Soft deletes a user found by email and password
    static async apiDeleteUsers (req,res,next) {
        try {
            const userInfo = {
                email: req.body.email.toLowerCase(),
                password: req.body.password,
            }

            Joi.assert(userInfo,Schemas.deleteUserSchema);

            const UserResponse = await UsersDAO.deleteUser(
                userInfo
            )
            if (UserResponse.matchedCount == 0) {
                res.status(400).json({ error: "User not found with email and password provided" });
            } else {
                res.json({ status:"success"})
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //* Specific methods
    //Gets a user by its username
    static async apiGetUserByUsername(req,res,next) {
        try {
            let username = req.body.username;
            let user = await UsersDAO.getUserByUsername(username);
            if(!user) {
                res.status(404).json({ error: "User not found"})
                return
            }
            res.json(user)
        } catch (e) {
            console.log(`api ${e}`);
            res.status(500).json({ error: e });
        }

    }
}