/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const mongoose = require("mongoose");

const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  // console.log(err.name, err.message);
  console.log(err);
  console.log("UNCAUGHT Exception! Shutting down ...");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001",

    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],

    credentials: true,
  },
});

const cors = require("cors");
const Event = require("./models/eventModel");
const User = require("./models/userModel");

const lobbyController=require("./controllers/lobbyController")

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log("DB Connection successful");
  });

// console.log(process.env);

const port = process.env.PORT || 8000;

// app.use(cors(
// {

// }

// ));
// app.use(
//   cors({
//      origin: "http://localhost:3001",
//     //origin: "*",
//     methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],

//     credentials: true,
//   })
// );
const { addUser, removeUser, getUser, getUsersInRoom } = lobbyController;
io.on('connect', (socket) => {

  socket.on('join', ({email,eventId} , callback) => {
    const { error, user } = addUser({ id: socket.id,email:email ,room: eventId });
  // console.log(user);

    if(error) return callback(error);

    socket.join(user.room);

    io.to(user.room).emit('roomData', {  users: getUsersInRoom(user.room) });


    callback();
  });

  socket.on('disconnect', () => {
    const user =removeUser(socket.id);
     
     if(user)
     {
    io.to(user.room).emit('roomData', {  users: getUsersInRoom(user.room) });
     }
  })
})

// 4. STARTING THE SERVER
server.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION! Shutting down ...");
  server.close(() => {
    process.exit(1);
  });
});
