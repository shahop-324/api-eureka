import io from "socket.io-client";
const socket = io("https://www.evenz.co.in", {path: "/api-eureka/socket.io"});

export default socket;
