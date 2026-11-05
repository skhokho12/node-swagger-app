import { Environment } from "./environment";

export const devEnvironment: Environment = {
  mongoUri:
    process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/zaio-backend",
  gmailAuth: {
    user: process.env.GMAIL_USER ?? "your-email@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD ?? "your-16-char-gmail-app-password",
  },
  sendgridAuth: {
    user: process.env.SENDGRID_USERNAME ?? "apikey",
    pass: process.env.SENDGRID_API_KEY ?? "your-sendgrid-api-key",
  },
};
