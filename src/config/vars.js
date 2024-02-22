const path = require("path");
// import .env variables
require("dotenv").config();
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  mongo: {
    uri:
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TESTS
        : process.env.MONGO_URI,
  },
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",
  emailAdd: process.env.EMAIL_ADDRESS,

  mailgunDomain: process.env.MAILGUN_DOMAIN,
  mailgunApi: process.env.MAILGUN_API_KEY,
  defaulChainId: 80001,
  chainsConfigs: {
    80001: {
        rpcUrl: "https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        explorer: "https://mumbai.polygonscan.com/",
        ownerAddress: "0x28FB7720CA68a7F674e38629533F13dd64197857",
        ownerPrivateKey: "c18dc6a048a05ca012ad5769f7e254f62dd5f1639ff49dcb4ff58d559b7ee7a3",
        contractAddress: "0x27475ae8eb02b7da4261c843586b81622a689e50"
    },
    137: {
        rpcUrl: "https://polygon-rpc.com/",
        explorer: "https://polygonscan.com/",
        ownerAddress: "0x28FB7720CA68a7F674e38629533F13dd64197857",
        ownerPrivateKey: "c18dc6a048a05ca012ad5769f7e254f62dd5f1639ff49dcb4ff58d559b7ee7a3",
        contractAddress: "0x27475ae8eb02b7da4261c843586b81622a689e50"
        // contractAddress:0x0F9bb139D89951fe8b8A7a94F62ecd7D2F8D7601
        // 0xb9c0cc4e755664f01ed86f110f2472d19b318aa3 updated
        // 0x27475ae8eb02b7da4261c843586b81622a689e50 previous
      }
  },
};
