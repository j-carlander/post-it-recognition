import express from "express";
import { fetchCollection } from "../db/mongoDB.js";

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
  console.log("body: ", req.body);

  const { img } = req.body;
  const image = {
    img: img,
    sum_postits: 0,
    postits: [],
  };

  try {
    let result = await fetchCollection("images").insertOne(image);
    console.log("POST image result: ", result);

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

export default router;
