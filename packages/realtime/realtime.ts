export enum ServerToClientEvent {
  WAITING_FOR_PLAYERS = "WAITING_FOR_PLAYERS",
  MATCH_STARTED = "MATCH_STARTED",
  MATCH_FINISHED = "MATCH_FINISHED",
}

export interface ServerToClientEvents {
  ["WAITING_FOR_PLAYERS"](): void;
  ["MATCH_STARTED"](questionId: number): void;
  ["MATCH_FINISHED"](winnerId: number | null): void;
}

export enum ClientToServerEvent {
  JOIN_QUEUE = "JOIN_QUEUE",
  ANSWER = "ANSWER",
}

export interface ClientToServerEvents {
  ["JOIN_QUEUE"](userId: number): void;
  ["ANSWER"](userId: number, optionId: number): void;
}

export interface InterServerEvents {}

export interface SocketData {}
