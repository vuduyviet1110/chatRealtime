const express = require("express");
const userController = require("../controllers/user.controller");
const { VerifyToken } = require("../middleware/verifyToken");
const route = express.Router();

route.get("/", VerifyToken, userController.getall);

module.exports = route;
