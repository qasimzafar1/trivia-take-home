import { AppConfig } from "../../utils/config.ts";
import { AppSocketServer } from "./realtime.types.ts";
import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { SocketService } from "./socket.service.ts";

export class RealtimeController {
  private io?: AppSocketServer;

  public setup(
    appConfig: AppConfig,
    server: Server,
    io = new SocketServer(server, {
      cors: {
        origin: appConfig.enabledOrigins,
        credentials: true,
      },
    }),
  ) {
    this.io = io;

    this.io.on("connection", (socket) => {
      const service = new SocketService(this.io!, socket);
      service.setup();

      socket.on("disconnect", () => {
        service.dispose();
      });
    });
  }
}
