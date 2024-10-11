import express from "express";
import { fetchCollection } from "../db/mongoDB.js";
import { spawn } from "child_process";

const router = express.Router();

router.get("/images", async (req, res) => {
  try {
    let result = await fetchCollection("images").find().toArray();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

router.post("/image", async (req, res) => {
  // console.log("body: ", req.body);

  const { img } = req.body;
  const image = {
    img: img,
    sum_postits: 0,
    postits: [],
  };

  // Start Python-process
  const pythonProcess = spawn("python", ["./backend/detect_postits.py"]);

  let result = "";

  // Send Base64-string to Python-script
  const base64Data = img.replace(/^data:image\/png;base64,/, "");
  pythonProcess.stdin.write(base64Data);
  pythonProcess.stdin.end();

  // Read output from Python-script
  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  // Catch if error
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });

  // When the Python-process is finished, save image to MongoDB and send answer
  pythonProcess.on("close", async (code) => {
    if (code !== 0) {
      console.log("Python process failed");
      res.status(500).send("Something went wrong");
    }
    console.log(JSON.stringify({ result: result.trim() }));
    try {
      let result = await fetchCollection("images").insertOne(image);
      console.log("POST image result: ", result);

      res.status(201).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  });
});

export default router;
