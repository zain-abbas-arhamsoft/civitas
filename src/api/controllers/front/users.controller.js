const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../../models/user.model");
exports.register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.send({
        success: false,
        message: "Please fill all required fields",
      });
    }

    let payload = req.body;
    let user = await User.findOne({
      $or: [{ email }],
    });
    if (user)
      return res.send({
        success: false,
        data: user,
        message: "A Wallet or Email already associated to some other user",
      });

    user = await User.create(payload);

    await user.save();
    return res.send({
      success: true,
      data: user,
      message: "User Signup successfully.",
    });
  } catch (error) {
    return next(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    let { email } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "Incorrect email or password" });

    passport.use(
      new localStrategy(
        { usernameField: "email" },
        (username, password, done) => {
          User.findOne(
            { email: username },
            "name email wallet password",
            (err, user) => {
              if (err) {
                return done(err);
              } else if (!user)
                // unregistered email
                return done(null, false, {
                  success: false,
                  message: "Incorrect email or password",
                });
              else if (!user.verifyPassword(password))
                // wrong password
                return done(null, false, {
                  success: false,
                  message: "Incorrect email or password",
                });
              else return done(null, user);
            }
          );
        }
      )
    );
    // call for passport authentication
    passport.authenticate("local", async (err, user, info) => {
      if (err)
        return res.status(400).send({
          err,
          success: false,
          message: "Oops! Something went wrong while authenticating",
        });
      // registered user
      else if (user) {
        var accessToken = await user.token();
        let data = {
          ...user._doc,
          accessToken,
        };
        await User.updateOne(
          { _id: user._id },
          { $set: { accessToken } },
          { upsert: true }
        );
        return res.status(200).send({
          success: true,
          message: "User logged in successfully",
          data,
        });
      }
      // unknown user or wrong password
      else
        return res
          .status(402)
          .send({ success: false, message: "Incorrect email or password" });
    })(req, res);
  } catch (error) {
    return next(error);
  }
};
