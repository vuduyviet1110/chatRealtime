const express = require("express");
const dotenv = require("dotenv");
const cookiesParser = require("cookie-parser");
const methodOverride = require("method-override");
const ConnectToDB = require("./db/ConnectToDB");
var cors = require("cors");
const passport = require("passport");
require("./middleware/authGg");
const route = require("./route");
const { httpServer, app } = require("./socket/socket");
dotenv.config();

const PORT = process.env.PORT || 8000;

//Use custome middleware
app.use(methodOverride("_method"));
app.use(cookiesParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: process.env.URL_CLIENT, credentials: true }));

//route
route(app);

// Các function
app.use(passport.initialize());

//lắng nghe port
httpServer.listen(PORT, () => {
  ConnectToDB();
  console.log(`Example app listening on port ${PORT}`);
});
