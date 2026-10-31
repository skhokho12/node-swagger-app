import { Server } from "./server";

const port = Number(process.env.PORT ?? 3000);

const server = new Server();

server.start(port).catch((err) => {
  console.error("Failed to start server:", err);
});
