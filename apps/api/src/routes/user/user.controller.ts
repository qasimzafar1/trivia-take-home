import { Request, Response, NextFunction } from "express";
import { AppController } from "../../utils/app-controller.ts";
import { AppConfig } from "../../utils/config.ts";
import { UserService } from "../../services/user.service.ts";

export class UserController extends AppController {
  service: UserService;

  constructor(config: AppConfig, service = new UserService()) {
    super();
    this.service = service;
  }

  createUser = async (
    req: Request<{ username: string; password: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { username, password } = req.body;
      const user = await this.service.createUser(username, password);
      return res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  };

  updateUser = async (
    req: Request<{ username: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
    } catch (e) {
      next(e);
    }
  };
}
