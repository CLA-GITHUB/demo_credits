import App from "./app";

const port = process.env.PORT;
const server = new App(port as unknown as number);
server.start();
