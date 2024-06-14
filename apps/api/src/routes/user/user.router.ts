import { AuthenticationMiddleware } from "../../middlewares/authentication.middleware.ts";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.ts";
import { AppRouter } from "../../utils/app-router.ts";
import { AppConfig } from "../../utils/config.ts";
import { UserController } from "./user.controller.ts";
import * as z from "zod";

export class UserRouter extends AppRouter {
  constructor(
    appConfig: AppConfig,
    controller = new UserController(appConfig),
    authenticationMiddleware = new AuthenticationMiddleware(appConfig),
  ) {
    super();

    this.router.post(
      "/",
      new ValidationMiddleware(
        z.object({
          username: z.string(),
          password: z.string(),
        }),
      ).validate,
      controller.createUser,
    );
    this.router.patch(
      "/:id",
      authenticationMiddleware.ensureAuthenticated,
      new ValidationMiddleware(
        z.object({
          username: z.string(),
        }),
      ).validate,
      controller.updateUser,
    );
  }
}
