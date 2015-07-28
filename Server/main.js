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

// require("./routes/test.js")(app);

var server = app.listen(process.env.PORT || 3000, () => {
	var {address: host, port} = server.address();

	console.log(`Listening on http://${host}:${port}/`);
});



var io = require("socket.io")(server)
// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

//new stuff, in addition to chat parts above
var users = {};
var teams = {};

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

  socket.on("register", function(data){
  	//eventually add auth here
  	socket.username = data.username;
  	users[data.username] = {socket: socket};
    socket.emit("loggedin", data.username);
  });
  socket.on("checkusername", function(username){
    if(false){ //add auth check here
      socket.emit("usernamecheckresponse", "not available");
    }
  });
  socket.on("checkteamname", function(teamname){
    console.log(teamname);
    console.log(teams);
    console.log(teamname in teams);
    if(teamname in teams){
      if(teams[teamname].users.length == 5){
        socket.emit("teamcheckresponse", "full");
      }
      else{
        socket.emit("teamcheckresponse", "exists");
      }
    }
    else{
      socket.emit("teamcheckresponse", "new");
    }
  });
  socket.on("jointeam", function(teamname){
    if(!(teamname in teams)){
      teams[teamname] = {
        name: teamname,
        users: []
      };
    }
    teams[teamname].users.push(socket.username);
    console.log(teams);
    socket.teamname = teamname;
    socket.emit("joinedteam");
    teams[teamname].users.forEach(function(user){
        socket.emit("newmember", user);
        if(user != socket.username){
          console.log("users");
          console.log(users);
          users[user].socket.emit("newmember", socket.username);
        }
    });
    if(teams[teamname].users.length == 5){
      teams[teamname].users.forEach(function(user){
        users[user].socket.emit("readytoselect");
      })
    }
  });
});
