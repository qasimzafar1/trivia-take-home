import { AppRouter } from "../utils/app-router.ts";
import { AppConfig } from "../utils/config.ts";
import { NextFunction, Request, Response } from "express";
import { ErrorMiddleware } from "../middlewares/error.middleware.ts";

import pkgJson from "../../package.json";
import { UserRouter } from "./user/user.router.ts";
import { AuthenticationMiddleware } from "../middlewares/authentication.middleware.ts";
import { QuestionRouter } from "./question/question.router.ts";
import { MatchRouter } from "./match/match.router.ts";
import { AuthRouter } from "./auth/auth.router.ts";

export class BaseRouter extends AppRouter {
  constructor(
    appConfig: AppConfig,
    errorMiddleware = new ErrorMiddleware(),
    authenticationMiddleware = new AuthenticationMiddleware(appConfig),
  ) {
    super();

    // SETUP SUB ROUTERS
    this.router.use("/auth", new AuthRouter(appConfig).router);
    this.router.use(
      "/user",
      authenticationMiddleware.identityUser,
      new UserRouter(appConfig).router,
    );
    this.router.use(
      "/match",
      authenticationMiddleware.identityUser,
      new MatchRouter(appConfig).router,
    );
    this.router.use(
      "/question",
      authenticationMiddleware.identityUser,
      new QuestionRouter(appConfig).router,
    );

    // General handlers for the base router
    this.router.use(/\/$/i, this.helloWorld);
    this.router.use("*", errorMiddleware.handleNotFound);
    this.router.use(errorMiddleware.handleGenericError);
    this.router.use("*", this.notFound);
  }

  helloWorld = (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json({ status: "Operational", version: pkgJson.version });
  };

  notFound = (req: Request, res: Response, next: NextFunction) => {
    return res.status(404).send();
  };
}
