const express = require("express");
const userRoutes = require("./user.route");
const router = express.Router();
/**
 * GET v1/status
 */
router.use("/user", userRoutes);
module.exports = router;
