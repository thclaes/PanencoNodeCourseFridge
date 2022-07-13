import { App } from "./app";

void (async () => {
  const app = new App();
  await app.createConnection();
  app.listen();
})();
