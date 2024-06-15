import { Socket, io } from 'socket.io-client'
import { type ClientToServerEvents, type ServerToClientEvents } from 'realtime/realtime'

export class SocketGlobal {
  static socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null

  static getSocket() {
    if (SocketGlobal.socket) {
      return SocketGlobal.socket
    }

    SocketGlobal.socket = io(import.meta.env.VITE_API_URL)

    return SocketGlobal.socket
  }
}
