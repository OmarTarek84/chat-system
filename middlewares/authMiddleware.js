const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader ? authHeader.split(" ")[1]: null;
  if (!token) {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.user = {
    first_name: decodedToken.first_name,
    last_name: decodedToken.last_name,
    user_id: decodedToken.user_id,
    email: decodedToken.email,
    gender: decodedToken.gender,
    avatar: decodedToken.avatar
  };
  next();
};
