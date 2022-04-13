import express from "express";
import DevicesCtrl from "./devices.controller.js";

const router = express.Router();

router.route("/").get(DevicesCtrl.apiGetDevices);
router.route("/records").post(DevicesCtrl.apiGetRecordsByDevice);

router.route("/CRUD")
    .post(DevicesCtrl.apiPostDevices)
    .put(DevicesCtrl.apiUpdateDevices)
    .delete(DevicesCtrl.apiDeleteDevices)

export default router;