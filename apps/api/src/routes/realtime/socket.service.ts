import { AppService } from "../../utils/app-service.ts";
import { AppSocket, AppSocketServer } from "./realtime.types.ts";

/**
 * Used to handle each individual socket connection
 */
export class SocketService extends AppService {
  /**
   * The socket.io server instance.
   * Use to emit events to match rooms.
   */
  private readonly io: AppSocketServer;
  private readonly socket: AppSocket;

  constructor(io: AppSocketServer, socket: AppSocket) {
    super();
    this.io = io;
    this.socket = socket;
  }

  public dispose() {
    this.socket.disconnect();
  }

  public setup() {
    // TODO: Setup all socket events here
  }
}
