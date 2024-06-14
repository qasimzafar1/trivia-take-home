import { AuthenticationMiddleware } from "../../middlewares/authentication.middleware.ts";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.ts";
import { AppRouter } from "../../utils/app-router.ts";
import { AppConfig } from "../../utils/config.ts";
import { AuthController } from "./auth.controller.ts";
import * as z from "zod";

export class AuthRouter extends AppRouter {
  constructor(
    appConfig: AppConfig,
    controller = new AuthController(appConfig),
  ) {
    super();

    this.router.post(
      "/login",
      new ValidationMiddleware(
        z.object({
          username: z.string(),
          password: z.string(),
        }),
      ).validate,
      controller.login,
    );
  }
}
