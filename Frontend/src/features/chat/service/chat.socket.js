import { io } from "socket.io-client";
const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function initializeSocketConnection() {
  const socket = io(socketUrl, {
    withCredentials: true,
  });

  console.log("socket is initialize....");

  socket.on("connect", () => {
    console.log("socket is connected");
  });

  return socket;
}
