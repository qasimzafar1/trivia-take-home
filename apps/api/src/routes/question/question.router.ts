import { AuthenticationMiddleware } from "../../middlewares/authentication.middleware.ts";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.ts";
import { AppRouter } from "../../utils/app-router.ts";
import { AppConfig } from "../../utils/config.ts";
import { QuestionController } from "./question.controller.ts";
import * as z from "zod";

export class QuestionRouter extends AppRouter {
  constructor(
    appConfig: AppConfig,
    controller = new QuestionController(appConfig),
    authenticationMiddleware = new AuthenticationMiddleware(appConfig),
  ) {
    super();

    this.router.get("/match-questions", controller.getMatchQuestions);
    this.router.post(
      "/",
      authenticationMiddleware.ensureAuthenticated,
      new ValidationMiddleware(
        z.object({
          question: z.string(),
          options: z.array(
            z.object({
              value: z.string(),
              isCorrect: z.boolean(),
            }),
          ),
        }),
      ).validate,
      controller.createQuestion,
    );
  }
}
