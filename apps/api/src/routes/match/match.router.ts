import { AuthenticationMiddleware } from "../../middlewares/authentication.middleware.ts";
import { AppRouter } from "../../utils/app-router.ts";
import { AppConfig } from "../../utils/config.ts";
import { MatchController } from "./match.controller.ts";

export class MatchRouter extends AppRouter {
  constructor(
    appConfig: AppConfig,
    controller = new MatchController(appConfig),
    authenticationMiddleware = new AuthenticationMiddleware(appConfig),
  ) {
    super();

    this.router.get(
      "/:id",
      authenticationMiddleware.ensureAuthenticated,
      controller.getMatch,
    );
  }
}
