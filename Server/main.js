"use strict";
const express = require("express"),
    logger = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    session = require("express-session"),
    mongojs = require("mongojs");

const MongoStore = require("connect-mongo")(session);

let app = express();

let config = {
    db: process.env.DBURL
};

// Integrate Middleware
app.use(logger("dev"));
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "keyboard cat",
    store: new MongoStore({ url: config.db })
}));

app.use((req, res, next) => {
    // MONGOJS - See GH for Docs
    req.db = mongojs(config.db);
    next();
});

app.get("/dynamic", (req, res) => {
	res.send("Hello, world");
});

app.use(express.static("Build/Client"));

require("./routes/test.js")(app);

let server = app.listen(process.env.PORT || 3000, () => {
	let {address: host, port} = server.address();

	console.log(`Listening on http://${host}:${port}/`);
});
