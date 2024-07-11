const jwt = require("jsonwebtoken");

const Token = {
  VerifyToken: (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      return res.status(403).json("Token is not valid");
    }
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  },
  verifyTokenAndAdminAuth: (req, res, next) => {
    this.VerifyToken(req, res, () => {
      if (req.user.isAdmin || req.user === req.params.id) {
        next();
      } else {
        res.status(403).json("You are not allowed to do that!");
      }
    });
  },
};
module.exports = Token;
