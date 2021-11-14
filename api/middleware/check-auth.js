const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_KEY;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // to remove 'Bearer' keyword from the token
    const decodeJwt = jwt.verify(token, jwtSecretKey);
    req.userData = decodeJwt;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth Fails!",
    });
  }
};
