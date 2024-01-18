const session = require("express-session");
const MongoStore = require('connect-mongo');


const MONGO_URI =
  process.env.MONGODB_URI;

module.exports = app => {

    app.set('trust proxy', 1);

      // use session
      app.use(
        session({
          secret: process.env.SESS_SECRET ,
          secret: 'your-secret-key', // Your current secret key
          resave: true,
          secure: false,
          saveUninitialized: false,
          cookie: {
            maxAge: 1000 * 60 * 60,
        },
      store: MongoStore.create({ mongoUrl: MONGO_URI })
    })
    );
  };