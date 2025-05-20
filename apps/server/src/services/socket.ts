import { Server, Socket } from "socket.io";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error('REDIS_URL environment variable is not set');
}

const pub = new Redis(redisUrl);
const sub = new Redis(redisUrl);

class SocketService {
  private _io: Server;

  constructor() {
    console.log("init socket server !!");
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: '*',
      }
    });
    sub.subscribe('Message');
  }

  private broadcastActiveCount() {
    const count = this._io.engine.clientsCount;
    this._io.emit('activeCount', count);
  }

  public initListeners() {
    const io = this._io;
    console.log("init socket listener");

    io.on("connect", (socket: Socket) => {
      console.log("new socket connected!", socket.id);
      this.broadcastActiveCount();

      socket.on("event:message", async ({ message, username }: { message: string, username: string }) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        await pub.publish('Message', JSON.stringify({ message, username, time }));
      });

      socket.on("typing", (username: string) => {
        socket.broadcast.emit("typing", username);
      });

      socket.on("clear", () => {
        io.emit("clear");
      });

      socket.on("getActiveCount", () => {
        this.broadcastActiveCount();
      });

      socket.on("disconnect", () => {
        this.broadcastActiveCount();
      });
    });

    sub.on('message', (channel, message) => {
      if (channel === "Message") {
        io.emit('message', message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;