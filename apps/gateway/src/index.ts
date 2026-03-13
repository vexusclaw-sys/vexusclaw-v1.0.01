import { startServer } from "./app/server";

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
