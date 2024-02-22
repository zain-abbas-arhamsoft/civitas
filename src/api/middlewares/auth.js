const byPassedRoutes = [
  "/v1/front/user/register",
  "/v1/front/user/login",
];

const jwt = require("jsonwebtoken");
const verifyAccessToken = async (req, res, next) => {
  console.log('hi')
  if (req.originalUrl.indexOf("/v1/") > -1) {
    if (byPassedRoutes.indexOf(req.originalUrl) > -1 ) {
      next();
    } else {
      if (req.headers["authorization"] === undefined) {
        return res
          .status(403)
          .send({ status: false, message: "Please login to access the data" });
      }
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      const JWT_SECRET = process.env.JWT_SECRET;
      await jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
      
          return res.status(500).json({
            status: false,
            message: "Failed to authenticate token.",
          });
        } else {
          let { sub } = payload;
          req.sub = sub;
          next();
        }
      });
    }
  }
};
exports.verifyAccessToken = verifyAccessToken;
