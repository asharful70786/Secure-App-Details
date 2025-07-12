import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

await mongoose.connect(
  "mongodb://127.0.0.1:27017/xss_attacks",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err));

const postSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);




// app.use((req, res, next) => {
//   //there are 3 properties in the Content-Security-Policy header : header , directive , value
//   res.header(  //self only show the own files from the server
//     "content-security-policy", "default-src 'self';"
//   )
//   next();
// })



app.use((req, res, next) => {
  if (req.headers.accept?.includes("text/html")) {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self';\
   script-src 'self' 'report-sample';\
   script-src-elem 'self' 'https://cdn.tailwindcss.com'\
   style-src 'self' 'unsafe-inline';\
   img-src 'self' https://images.unsplash.com;\
   connect-src 'self';\
   report-uri /csp-violation"
    );
  }
  next();
});

app.use(express.static("./public"));

// Routes
app.get("/posts", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.setHeader("Set-Cookie", "loginSecret=hdxhw7yrx.k;");
  res.json(posts);
});




app.post("/posts", async (req, res) => {
  const post = new Post({ content: req.body.content });
  await post.save();
  res.status(201).json(post);
});



//here im handling the CSP Violation
app.post("/csp-violation", express.json({ type: "application/csp-report" }), (req, res) => {
  console.log(req.body);
  res.status(200).send();
})


// Start server
app.listen(4000, () => console.log("Server running on http://localhost:4000"));
