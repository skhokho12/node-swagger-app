import { Router } from "express";
import { UserController } from "../controllers/userController";
import { Utils } from "../utils/utils";
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
    this.router.post(
      "/login",
      ...UserValidators.login(),
      new UserController().login,
    );

    this.router.get("/test", (req, res, next) => {
      console.log("Test endpoint hit");
      (req as any).msg = "Test endpoint hit";
      next();
      res.send((req as any).msg);
    });

    this.router.get("/me", (req, res) => {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

      if (!token) {
        return res.status(401).json({ error: "Bearer token required" });
      }

      try {
        const user = Utils.verifyToken(token);
        return res.status(200).json({ user });
      } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
    });
  }

  postRoutes() {
    this.router.post(
      "/register",
      ...UserValidators.signup(),
      new UserController().register,
    );
  }

  patchRoute() {
    this.router.patch(
      "/verify",
      ...UserValidators.verifyUserEmail(),
      new UserController().verify,
    );
  }

  putRoutes() {}

  deleteRoutes() {}
}

export default new userRoutes().router;
