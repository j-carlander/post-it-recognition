import "dotenv/config";
import express from "express";

const app = express();

app.use("/api/health", (req, res) => res.send("Server is healthy"));

app.listen(process.env.SERVERPORT, () => console.log("Server up and running"));
