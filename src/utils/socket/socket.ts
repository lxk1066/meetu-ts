import { SocketURL } from "@/project.config";
import { io } from "socket.io-client";

const socket = io(SocketURL);

export default socket;
