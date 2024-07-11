const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const passport = require("passport");
let refreshTokens = [];
class AuthController {
  async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const matchedUser = await User.findOne({ email: email });
      if (!matchedUser) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      const ValidatePassword = await bcrypt.compare(
        password,
        matchedUser.password
      );

      if (!ValidatePassword) {
        return res
          .status(404)
          .json({ success: false, message: "Wrong password" });
      }

      if (matchedUser && ValidatePassword) {
        const accessToken = generateAccessToken(matchedUser);
        const refreshToken = generateRefreshToken(matchedUser, res);
        refreshTokens.push(refreshToken);

        res.status(200).json({ accessToken: accessToken, ok: true });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }

  loginGg(req, res, next) {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  }
  loginCallback(req, res, next) {
    passport.authenticate("google", {
      successRedirect: process.env.URL_CLIENT,
      failureRedirect: "/api/auth/login/failed",
    });
  }
  loginSuccess(req, res, next) {
    if (req.user) {
      res.status(200).json({
        error: false,
        message: "Successfully Loged In",
        user: req.user,
      });
    } else {
      res.status(403).json({ error: true, message: "Not Authorized" });
    }
  }
  loginFailed(req, res, next) {
    res.status(401).json({
      error: true,
      message: "Log in failure",
    });
  }
  async signup(req, res) {
    try {
      const { fullName, email, password, confirmPassword, gender } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords don't match" });
      }

      const user = await User.findOne({ fullName });

      if (user) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // HASH PASSWORD HERE
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // https://avatar-placeholder.iran.liara.run/

      const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${fullName}`;
      const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${fullName}`;

      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      });

      if (newUser) {
        // Generate JWT token here
        // generateAccessToken.generateRefreshToken(newUser, res);
        await newUser.save();

        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });
      } else {
        res.status(400).json({ error: "Invalid user data" });
      }
    } catch (error) {
      console.log("Error in signup controller", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async logOut(req, res, next) {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json({ message: "Logged out successfully" });
  }
  async logOutGg(req, res, next) {
    req.logout();
    res.redirect(process.env.URL_CLIENT);
  }
  refreshToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: "Refresh token not valid" });
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Refresh token not valid" });
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      const NewaccessToken = generateAccessToken(user);
      const NewRefreshToken = generateRefreshToken(user, res);
      refreshTokens.push(NewRefreshToken);
      res.status(200).json({ NewaccessToken });
    });
  }
}
module.exports = new AuthController();
