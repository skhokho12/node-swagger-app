import express from "express";
import mongoose from "mongoose";
import { getEnvironment } from "./environment";
import cors from "cors";
import userRoutes from "./routes/useRoute";
import bodyParser from "body-parser";

export class Server {
  public app = express();

  constructor() {
    this.setConfig();
    this.setRoutes();
    this.notFoundHandler();
    this.errorHandler(); // ← must be LAST
  }

  private setConfig() {
    this.app.use(express.json());
    this.app.use(cors());
    // this.configuredBodyParser();
  }

  private configuredBodyParser() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private async connectMongoDB() {
    await mongoose.connect(getEnvironment().mongoUri);
    console.log("MongoDB connected");
  }

  private setRoutes() {
    this.app.use("/api/user", userRoutes);
  }

  public async start(port: number): Promise<void> {
    await this.connectMongoDB();

    await new Promise<void>((resolve, reject) => {
      const server = this.app.listen(port, () => {
        server.off("error", reject);
        console.log(`Server running on port ${port}`);
        resolve();
      });
      server.on("error", (error: NodeJS.ErrnoException) => reject(error));
    });
  }

  private notFoundHandler() {
    this.app.use((req, res) => {
      res.status(404).json({ error: "Not Found" });
    });
  }

  private errorHandler() {
    this.app.use(
      (
        err: unknown,
        _req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        console.error(err);
        if (res.headersSent) return next(err);
        res.status(500).json({ error: "Internal Server Error" });
      },
    );
  }
}
