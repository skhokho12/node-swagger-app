import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserValidators } from "../validator/uservalidator";

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
    this.router.post("/login", ...UserValidators.login(), new UserController().login);

    this.router.get("/test", (req, res, next) => {
      console.log("Test endpoint hit");
      (req as any).msg = "Test endpoint hit";
      next();
      res.send((req as any).msg);
    });
  }

  postRoutes() {
    this.router.post(
      "/register",
      ...UserValidators.signup(),
      new UserController().register
    );
  }

  patchRoute() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new userRoutes().router;
