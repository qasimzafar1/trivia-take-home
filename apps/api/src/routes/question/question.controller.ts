import { Request, Response, NextFunction } from "express";
import { AppController } from "../../utils/app-controller.ts";
import { AppConfig } from "../../utils/config.ts";
import { QuestionService } from "../../services/question.service.ts";
import { QuestionOption } from "@prisma/client";

export class QuestionController extends AppController {
  service: QuestionService;

  constructor(config: AppConfig, service = new QuestionService()) {
    super();
    this.service = service;
  }

  getMatchQuestions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const questions = await this.service.getMatchQuestions();
      return res.status(201).json({
        questions,
      });
    } catch (e) {
      next(e);
    }
  };

  getQuestion = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const question = await this.service.getQuestion(Number(id));
      return res.status(200).json({
        question,
      });
    } catch (e) {
      next(e);
    }
  };

  createQuestion = async (
    req: Request<
      unknown,
      unknown,
      {
        question: string;
        options: Pick<QuestionOption, "isCorrect" | "value">;
      }
    >,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { question, options } = req.body;
      const created = await this.service.createQuestion(question, options);
      return res.status(201).json(created);
    } catch (e) {
      next(e);
    }
  };
}
