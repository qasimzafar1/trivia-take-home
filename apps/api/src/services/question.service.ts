import { QuestionOption } from "@prisma/client";
import { AppService } from "../utils/app-service.ts";

export class QuestionService extends AppService {
  async getMatchQuestions(size = 5) {
    const db = await this.getDb();

    const list = db.question.findMany({
      take: size,
      include: {
        options: true,
      },
    });

    // TODO: Implement shuffling
    return list;
  }

  async createQuestion(
    question: string,
    options: Pick<QuestionOption, "value" | "isCorrect">,
  ) {
    const db = await this.getDb();

    return db.question.create({
      data: {
        question,
        options: {
          createMany: {
            data: options,
          },
        },
      },
      include: {
        options: true,
      },
    });
  }
}
