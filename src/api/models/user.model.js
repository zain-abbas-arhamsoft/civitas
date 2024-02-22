const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const jwt = require("jwt-simple");
const { env, jwtSecret, jwtExpirationInterval } = require("../../config/vars");

/**
 * User Schema
 * @private
 */
const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    wallet: {
      type: String,
    },
    email: { type: String },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128,
    },
    type: {
      type: Number,
    },
    role: {
      type: String,
    },
    image: { type: String },
    accessToken: { Type: String },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();
    const rounds = env === "development" ? 1 : 10;
    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  try {
    let update = { ...this.getUpdate() };
    // Only run this function if password was modified
    if (update.password) {
      // Hash the password
      const rounds = env === "development" ? 1 : 10;
      update.password = await bcrypt.hash(update.password, rounds);
      const hashpassword = update.password;
      this.setUpdate(update);
    }
    return next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.method({
  transform() {
    const transformed = {};
    const fields = ["_id", "name", "wallet", "email"];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },

  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, "minutes").unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(playload, jwtSecret);
  },
  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * @typedef User
 */

module.exports = mongoose.model("User", UserSchema);
