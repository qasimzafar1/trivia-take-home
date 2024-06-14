import { Request, Response, NextFunction } from "express";
import { AppController } from "../../utils/app-controller.ts";
import { AppConfig } from "../../utils/config.ts";
import { UserService } from "../../services/user.service.ts";
import { JwtService } from "../../services/utils/jwt.service.ts";
import { PasswordService } from "../../services/utils/password.service.ts";

export class AuthController extends AppController {
  jwtService: JwtService;
  passwordService: PasswordService;
  service: UserService;

  constructor(
    config: AppConfig,
    jwtService = new JwtService(config),
    passwordService = new PasswordService(),
    service = new UserService(),
  ) {
    super();
    this.jwtService = jwtService;
    this.passwordService = passwordService;
    this.service = service;
  }

  login = async (
    req: Request<{ username: string; password: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { username, password } = req.body;
      const user = await this.service.find(username);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const isValid = this.passwordService.compare({
        password,
        hash: user.password_digest,
        salt: user.password_salt,
      });

      if (!isValid) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const token = await this.jwtService.createToken({ sub: user.username });

      return res.status(201).json({
        user,
        token,
      });
    } catch (e) {
      next(e);
    }
  };
}
