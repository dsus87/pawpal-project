const session = require("express-session");
const MongoStore = require('connect-mongo');

module.exports = app => {

    app.set('trust proxy', 1);

      // use session
      app.use(
        session({
          secret: process.env.SESS_SECRET || "your-default-secret-key",
          resave: true,
          secure: false,
          saveUninitialized: false,
          cookie: {
            maxAge: 1000 * 60 * 60,
        },
      store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/pawpal' })
    })
    );
  };