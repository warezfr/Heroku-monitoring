import express from "express";
import CompaniesCtrl from "./companies.controller.js";

const router = express.Router();

router.route("/").get(CompaniesCtrl.apiGetCompanies);
router.route("/name").get(CompaniesCtrl.apiGetCompanyByName);
//router.route("/test").get(CompaniesCtrl.apiGetID);
router.route("/users").get(CompaniesCtrl.apiGetUsersByCompany);
router.route("/devices").get(CompaniesCtrl.apiGetDeviceByCompany);
router.route("/records").post(CompaniesCtrl.apiGetDeviceAndRecordByCompany);

router.route("/CRUD")
    .post(CompaniesCtrl.apiPostCompanies)
    .put(CompaniesCtrl.apiUpdateCompanies)
    .delete(CompaniesCtrl.apiDeleteCompanies)

export default router;