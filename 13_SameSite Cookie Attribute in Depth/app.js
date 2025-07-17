import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 4000;

app.use(cookieParser());

const authMiddleware = (req, res, next) => {
  if (req.cookies.sid || req.url === "/login") {
    return next();
  }
  return res.send('You are not logged in<br> <a href="/login">Login</a>');
};

app.use(authMiddleware, express.static("./public"));

app.get("/", authMiddleware, (req, res) => {
  res.send(`
    Hello World <br> <img src='/cookie.png' width='200'>
    <form action="/cookie.png" method="post">
        <button>Open Cookie Image</button>
    </form>`);
});

app.post("/cookie.png", authMiddleware, (req, res) => {
  res.sendFile(`${import.meta.dirname}/public/cookie.png`);
});

app.get("/login", (req, res) => {
  res.cookie("sid", "12345", {
    sameSite: "none",
    // secure: true,
  });
  res.redirect(req.headers.referer || "/");
});

app.listen(PORT, () => {
  console.log(`🚀 Visit http://localhost:${PORT}`);
});

// https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Win_x64/708605/
