import express from "express";
import RecordsCtrl from "./records.controller.js";

const router = express.Router();

router.route("/").get(RecordsCtrl.apiGetRecords)
router.route("/test").post(RecordsCtrl.apiAddTestRecords)
//router.route("/delete").delete(RecordsCtrl.apiDeleteAllRecords)



router.route("/CRUD")
    .post(RecordsCtrl.apiPostRecords)
    .delete(RecordsCtrl.apiDeleteRecords)

export default router;