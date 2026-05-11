const session = require("express-session");

function sessionConfig() {
  return session({
    secret: process.env.SESSION_SECRET || "cwsms-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 },
  });
}

module.exports = sessionConfig;
