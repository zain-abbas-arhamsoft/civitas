const mongoose = require("mongoose");
const { mongo, env } = require("./vars");

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (env === "development") {
  mongoose.set("debug", true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  const connection = mongoose.connect(mongo.uri, {
    useNewUrlParser: true,
    keepAlive: 1,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  // Log connection status
  connection
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });

  return connection;
};

