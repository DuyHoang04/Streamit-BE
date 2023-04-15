const jwt = require("jsonwebtoken");

const generateAccessToken = (id, isAdmin) => {
  return jwt.sign(
    {
      id,
      isAdmin,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "7d",
    }
  );
};

const generateTokenResetPass = (id, isAdmin) => {
  return jwt.sign(
    {
      id,
      isAdmin,
    },
    process.env.JWT_RESET_KEY,
    {
      expiresIn: "7d",
    }
  );
};

const generateRefreshToken = (id, isAdmin) => {
  return jwt.sign(
    {
      id,
      isAdmin,
    },
    process.env.JWT_REFRESH_KEY,
    {
      expiresIn: "365d",
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenResetPass,
};
