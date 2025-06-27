import express from "express";
import mongoose from "mongoose";

import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify'; // ✅ use "createDOMPurify", not "DOMPurify" directly

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window); // ✅ now this is a working instance

const app = express();
app.use(express.json());

await mongoose.connect("mongodb://127.0.0.1:27017/xss_attacks")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const postSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

app.use(express.static("./public"));

app.get("/posts", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.setHeader("Set-Cookie", "loginSecret=hdxhw7yrx.k; httpOnly=true");
  res.json(posts);
});

app.post("/posts", async (req, res) => {
  try {
    const cleanContent = DOMPurify.sanitize(req.body.content);
    console.log(cleanContent) // ✅ now works
    const post = new Post({ content: cleanContent });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
