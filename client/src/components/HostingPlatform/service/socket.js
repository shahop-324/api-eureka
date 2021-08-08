import io from "socket.io-client";
const socket = io("http://www.bez-app.com:3000/");

export default socket;
