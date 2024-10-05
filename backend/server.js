import "dotenv/config";
import express from "express";
import router from "./router/router.js";

const app = express();
app.use(express.json());

app.use("/health", (req, res) => res.send("Server is healthy"));

app.use("/api", router);

app.listen(process.env.SERVERPORT, () => console.log("Server up and running"));
