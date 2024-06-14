import { NextFunction, Request, Response } from "express";
import { HTTPStatus } from "../constants/http.ts";
import { AppController } from "../utils/app-controller.ts";
import { ServerError } from "../utils/server-error.ts";
import { ZodSchema } from "zod";

export class ValidationMiddleware<
  S extends Record<string, any>,
> extends AppController {
  private readonly schema: ZodSchema<S>;

  constructor(schema: ZodSchema<S>) {
    super();
    this.schema = schema;
  }

  validate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const result = this.schema.safeParse(req.body);

    if (result.data) {
      next();
    } else {
      throw new ServerError(
        HTTPStatus.BAD_REQUEST,
        result.error?.message ?? "Unknown schema validation error",
        {
          validation: result.error,
        },
      );
    }
  };
}
