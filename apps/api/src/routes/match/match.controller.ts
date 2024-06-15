import { Request, Response, NextFunction } from "express";
import { AppController } from "../../utils/app-controller.ts";
import { AppConfig } from "../../utils/config.ts";
import { MatchService } from "../../services/match.service.ts";

export class MatchController extends AppController {
  service: MatchService;

  constructor(config: AppConfig, service = new MatchService()) {
    super();
    this.service = service;
  }

  getMatch = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const match = await this.service.getMatch(Number(id));
      return res.status(200).json({
        match,
      });
    } catch (e) {
      next(e);
    }
  };

  createMatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const created = await this.service.createMatch();
      return res.status(201).json(created);
    } catch (e) {
      next(e);
    }
  };
}
