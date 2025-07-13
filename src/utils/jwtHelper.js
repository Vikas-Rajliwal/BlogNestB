const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const createTokenForUser = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};

module.exports = { createTokenForUser };
