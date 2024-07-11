const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const token = jwt.sign(
    {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1d" }
  );
  return token;
};
const generateRefreshToken = (user, res) => {
  const token = jwt.sign(
    {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "1d" }
  );
  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: false,
  });
};
module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
