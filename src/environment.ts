import { prodEnvironment } from "./environment.prod";
import { devEnvironment } from "./environment.dev";

export interface Environment {
  mongoUri: string;
  gmailAuth?: {
    user?: string;
    pass?: string;
  };
  sendgridAuth?: {
    user?: string;
    pass?: string;
  };
}

export function getEnvironment() {
  if (process.env.NODE_ENV === "production") {
    return prodEnvironment;
  } else {
    return devEnvironment;
  }
}
