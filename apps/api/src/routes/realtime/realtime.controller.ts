import { AppConfig } from "../../utils/config.ts";
import { AppSocketServer, WaitingPlayer, Match } from "./realtime.types.ts";
import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { SocketService } from "./socket.service.ts";
import { QuestionService } from "../../services/question.service.ts";
import { MatchService } from "../../services/match.service.ts";

export class RealtimeController {
  private io?: AppSocketServer;
  private questionService?: QuestionService;
  private matchService?: MatchService;
  private waitingPlayer: WaitingPlayer | null = null;
  private match: Match | null = null;

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
    this.matchService = new MatchService();
    this.questionService = new QuestionService();

    this.io.on("connection", (socket) => {
      const service = new SocketService(this.io!, socket);
      service.setup();

      socket.on("JOIN_QUEUE", async (userId: number): Promise<void> => {
        try {
          if (this.waitingPlayer) {
            this.match;
            const match = await this.matchService?.createMatch();
            const questions = await this.questionService?.getMatchQuestions();
            const room = `match_${match?.id}`;

            this.match = {
              matchId: match?.id,
              player1: this.waitingPlayer.userId,
              player2: userId,
              score1: 0,
              score2: 0,
              turn1: true,
              turn2: true,
              remainingQuestions: 5,
              questions: questions,
            };

            socket.join(room);
            this.waitingPlayer.socket.join(room);

            io.to(room).emit("MATCH_STARTED", questions![0].id);

            this.waitingPlayer = null;
          } else {
            this.waitingPlayer = { id: socket.id, userId, socket };
            socket.emit("WAITING_FOR_PLAYERS");
          }
        } catch (error) {
          console.log(error);
        }
      });

      socket.on(
        "ANSWER",
        async (userId: number, optionId: number): Promise<void> => {
          try {
            const remainingQuestions = this.match!.remainingQuestions;
            const question = this.match!.questions![5 - remainingQuestions];
            const answer = question.options.find((q) => q.isCorrect);

            if (this.match?.player1 === userId) {
              if (answer!.id === optionId) {
                this.match.score1 += 1;
              }
              this.match.turn1 = false;
            } else if (this.match?.player2 === userId) {
              if (answer!.id === optionId) {
                this.match.score2 += 1;
              }
              this.match.turn2 = false;
            }

            if (!this.match?.turn1 && !this.match?.turn2) {
              if (this.match?.remainingQuestions === 1) {
                const winnerId =
                  this.match?.score1 === this.match?.score2
                    ? null
                    : this.match?.score1 > this.match?.score2
                      ? this.match?.player1
                      : this.match?.player2;
                this.matchService?.updateMatch(this.match.matchId!, winnerId);
                io.to(`match_${this.match.matchId}`).emit(
                  "MATCH_FINISHED",
                  winnerId,
                );
              } else {
                this.match!.remainingQuestions =
                  this.match!.remainingQuestions - 1;
                this.match!.turn1 = true;
                this.match!.turn2 = true;
                io.to(`match_${this.match?.matchId}`).emit(
                  "MATCH_STARTED",
                  this.match!.questions![5 - this.match!.remainingQuestions].id,
                );
              }
            }
          } catch (error) {
            console.log(error);
          }
        },
      );

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        if (this.waitingPlayer && this.waitingPlayer.id === socket.id) {
          this.waitingPlayer = null;
        } else {
          if (this.match) {
            const winnerId =
              this.match?.score1 === this.match?.score2
                ? null
                : this.match?.score1 > this.match?.score2
                  ? this.match?.player1
                  : this.match?.player2;

            console.log("match finished", winnerId);

            this.matchService?.updateMatch(this.match.matchId!, winnerId);

            io.to(`match_${this.match.matchId}`).emit(
              "MATCH_FINISHED",
              winnerId,
            );
          }
        }
        service.dispose();
      });
    });
  }
}
