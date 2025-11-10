import { Server, Socket } from "socket.io";
import { Server as httpServer } from "http";
import { verifyToken } from "../Utils/Tokens/tokens.utils.js";
import { ChatInitiation } from "../Modules/Chat/chat.js";

export const connectedSokets = new Map<string, string[]>();
let io: Server | null = null;

function sockentAuthentication(socket: Socket, next: Function) {
  const token = socket.handshake.auth?.authorization;

  if (!token) {
    console.log("No token provided from client");
    return next(new Error("Authentication error: Token required"));
  }

  try {
    const decodeData = verifyToken(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    socket.data = {
      userId: decodeData._id,
      firstName: decodeData.firstName,
      lastName: decodeData.lastName,
    };

    const userTabs = connectedSokets.get(socket.data.userId);
    if (!userTabs) {
      connectedSokets.set(socket.data.userId, [socket.id]);
    } else {
      userTabs.push(socket.id);
    }

    socket.emit("connected", {
      user: {
        _id: socket.data.userId,
        firstName: socket.data.firstName,
        lastName: socket.data.lastName,
      },
    });

    next();
  } catch (err) {
    console.log("Invalid or expired token:", err);
    return next(new Error("Authentication error: Invalid token"));
  }
}

function socketDisconnected(socket: Socket) {
  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    let userTaps = connectedSokets.get(userId);
    if (userTaps && userTaps.length) {
      userTaps = userTaps.filter((tab) => tab !== socket.id);
      if (!userTaps.length) connectedSokets.delete(userId);
    }
    socket.broadcast.emit("disconnect_user", { userId, socketId: socket.id });
  });
}

export const ioIntializer = (server: httpServer) => {
   io = new Server(server, { cors: { origin: "*" } });

  io.use(sockentAuthentication);

  io.on("connection", (socket: Socket) => {
    ChatInitiation(socket);
    socketDisconnected(socket);
  });
};

export const getIo = () => {
  try {
    if (!io) throw new Error("socket.io not initialized");
    return io;
  } catch (error) {
    console.log(error);
  }
};
