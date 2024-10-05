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

export default router;
