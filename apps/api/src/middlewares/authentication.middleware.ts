import { NextFunction, Request, Response } from "express";
import { HTTPStatus } from "../constants/http.ts";
import { AppController } from "../utils/app-controller.ts";
import { ServerError } from "../utils/server-error.ts";
import { AppConfig } from "../utils/config.ts";
import { JwtService } from "../services/utils/jwt.service.ts";
import { AppContext } from "../constants/context.ts";
import { UserService } from "../services/user.service.ts";

export class AuthenticationMiddleware extends AppController {
  private readonly appConfig: AppConfig;
  private readonly jwtService: JwtService;
  private readonly service: UserService;

  constructor(
    appConfig: AppConfig,
    jwtService = new JwtService(appConfig),
    service = new UserService(),
  ) {
    super();
    this.appConfig = appConfig;
    this.jwtService = jwtService;
    this.service = service;
  }

  identityUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const token = req.headers[this.header] as string;

      if (!token) {
        throw new ServerError(HTTPStatus.UNAUTHORIZED, "No token provided");
      }

      const tokenData = await this.jwtService.verifyToken(token);

      if (!tokenData.sub) {
        throw new ServerError(HTTPStatus.UNAUTHORIZED, "Invalid token");
      }

      const user = await this.service.find(tokenData.sub);

      res.locals = {
        ...res.locals,
        user,
      };

      next();
    } catch (e) {
      next(e);
    }
  };

  ensureAuthenticated = async (
    req: Request,
    res: Response<unknown, AppContext>,
    next: NextFunction,
  ): Promise<void> => {
    if (!res.locals.user) {
      throw new ServerError(HTTPStatus.UNAUTHORIZED, "Unauthorized");
    }

    next();
  };

  private readonly header = "Authorization";
}
