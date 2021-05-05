import express from "express";

import logger from "./logger";
import redisClient from "./RedisClient";



const app = express();

app.get("", (req, res) => {
  res.status(200).json({ message: redisClient.get("test") });
});

app.put("", (req, res) => {
	redisClient.set("test", "asdf");
  res.status(200).json({ message: "new value saved" });
});


logger.info("starting app");
app.listen(3000);
