import express from "express";
import UsersCtrl from "./users.controller.js";

const router = express.Router();

router.route("/").get(UsersCtrl.apiGetUsers);
router.route("/username").get(UsersCtrl.apiGetUserByUsername);

router
    .route("/login")
    .post(UsersCtrl.apiPostUsers)
    .put(UsersCtrl.apiUpdateUsers)
    .delete(UsersCtrl.apiDeleteUsers)

export default router;