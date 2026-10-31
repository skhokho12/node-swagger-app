export class UserController {
  public async login(req: any, res: any): Promise<void> {
    try {
      const data = [{ name: "vusi" }];
      res.status(200).send(data);
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
}
