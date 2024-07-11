const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const conversationRoute = require("./conversationRoute");
const Routes = (app) => {
  app.use("/", authRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/conversation", conversationRoute);
};

module.exports = Routes;
