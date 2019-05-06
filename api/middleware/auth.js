const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
      const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "nodeSecret");
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: err, message: "Unauthenticated ." });
  }
};
// this is how to store a tken locally 
// localStorage.setItem('token':token);
// this removes a single file form local storage
// localStorage.removeItem('token')
// this is how you remove all from local storage
// localStorage.clear();
