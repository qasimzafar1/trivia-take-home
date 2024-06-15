import { QuestionOption } from "@prisma/client";
import { AppService } from "../utils/app-service.ts";

export class QuestionService extends AppService {
  async getMatchQuestions(size = 5) {
    const db = await this.getDb();

    const questions = await db.$queryRaw<
      { id: number; question: string }[]
    >`SELECT * FROM question ORDER BY RANDOM() LIMIT ${size};`;

    const questionIds = questions.map((q) => q.id);
    const options = await db.questionOption.findMany({
      where: { questionId: { in: questionIds } },
    });

    const questionMap = questions.map((question) => ({
      ...question,
      options: options.filter((option) => option.questionId === question.id),
    }));

    return questionMap;
  }

  async getQuestion(id: number) {
    const db = await this.getDb();

    return db.question.findUnique({
      where: { id },
      include: {
        options: true,
      },
    });
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
