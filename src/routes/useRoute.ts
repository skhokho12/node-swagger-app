import { Router } from "express";
import { UserController } from "../controllers/userController";

class userRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.patchRoute();
    this.putRoutes();
    this.deleteRoutes();
  }

  getRoutes() {
    this.router.get("/login", new UserController().login);

    this.router.get("/test", (req, res, next) => {
      console.log("Test endpoint hit");
      (req as any).msg = "Test endpoint hit";
      next();
      res.send((req as any).msg);
    });
  }

  postRoutes() {}
  patchRoute() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new userRoutes().router;
