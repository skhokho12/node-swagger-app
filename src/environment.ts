import { prodEnvironment } from "./environment.prod";
import { devEnvironment } from "./environment.dev";
// import { getEnvironment } from "./environment";

export interface Environment {
  mongoUri: string;
  //   dbConnectionString: string;
}

export function getEnvironment() {
  if (process.env.NODE_ENV === "production") {
    return prodEnvironment;
  } else {
    return devEnvironment;
  }
}
