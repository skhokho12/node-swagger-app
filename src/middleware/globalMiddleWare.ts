import type { Request, Response, NextFunction } from "express";

export class GlobalMiddleWare {
  static async errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    console.error(err?.stack || err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
