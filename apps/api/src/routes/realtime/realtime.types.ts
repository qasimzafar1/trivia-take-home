import { Socket, Server as SocketServer } from "socket.io";

import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "realtime/realtime.ts";

export type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type AppSocketServer = SocketServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type WaitingPlayer = {
  id: string;
  userId: number;
  socket: Socket<ClientToServerEvents, ServerToClientEvents>;
};

export type QuestionOption = {
  id: number;
  value: string;
  isCorrect: boolean;
};

export type Question = {
  id: number;
  question: string;
  options: Array<QuestionOption>;
};

export type Match = {
  matchId?: number;
  player1: number;
  player2: number;
  score1: number;
  score2: number;
  turn1: boolean;
  turn2: boolean;
  remainingQuestions: number;
  questions?: Array<Question>;
};
