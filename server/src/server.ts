import { app } from "./app";
const port = process.env.PORT || 4000;

console.log(process.env);
try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
