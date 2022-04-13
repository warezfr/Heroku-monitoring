import express from "express";
import cors from "cors";
import users from "./api/users.route.js";
import companies from "./api/companies.route.js";
import devices from "./api/devices.route.js";
import records from  "./api/records.route.js";
import dotenv from "dotenv";
import * as path from 'path'

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/v1/users",users);
app.use("/api/v1/companies",companies);
app.use("/api/v1/devices",devices);
app.use("/api/v1/records",records);

__dirname = path.resolve();
if (process.env.NODE_DEV === 'production'){
    app.use(express.static(path.join(__dirname,'frontend','build')))
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname,'frontend','build','index.html'));
    });
} else {
    app.use("*", (req,res) => res.status(404).json({error: "route not found"}));
}

//Exportation
export default app;
