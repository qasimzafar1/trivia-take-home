export enum ServerToClientEvent {
  MATCH_FINISHED = "MATCH_FINISHED",
}

export interface ServerToClientEvents {
  [ServerToClientEvent.MATCH_FINISHED](winner: string | null): void;
}

export enum ClientToServerEvent {
  JOIN_QUEUE = "JOIN_QUEUE",
}

export interface ClientToServerEvents {
  [ClientToServerEvent.JOIN_QUEUE](callback: (success: boolean) => void): void;
}

export interface InterServerEvents {}

export interface SocketData {}
