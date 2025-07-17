import https from "https";
import express from "express";
import { readFileSync } from "fs";

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

const sslOptions = {
  key: readFileSync("./key.pem"),
  cert: readFileSync("./cert.pem")
};

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🚀 HTTPS server running at https://localhost:${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`🚀 Visit http://localhost:${PORT}`);
// });
