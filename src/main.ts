import express from "express";
import { body, query, validationResult } from "express-validator";

import logger from "./logger";
import Store from "./Store";
import Queue from "./Queue";
import apiRouter from "./apiRouter";
import redisClient from "./db";

const store = new Store(redisClient);
const queue = new Queue(redisClient);

const app = express();

app.use(express.json());
app.use("/apiKeys", apiRouter);

const storeRouter = express.Router();
storeRouter.get("/:someKey", async (req, res) => {
  const val = await store.get(req.params.someKey);
  res.status(200).json({ val });
});

storeRouter.put("/:someKey", body("val").isString(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
    return;
  }

  const someKey: string = req.params?.someKey;
  store.set(someKey, req.body.val);
  res.status(200).json({ message: "new value saved" });
});

storeRouter.delete("/:someKey", (req, res) => {
  store.delete(req.params.someKey);
  res.status(200).json({ message: "value deleted" });
});

app.use("/store", storeRouter);

const queueRouter = express.Router();

queueRouter.put("", body("val").isString(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
    return;
  }
  queue.pushToQueue(req.body.val);
  res.status(200).json({ message: "new value pushed to queue" });
});

queueRouter.get("", query("wait").optional().isBoolean(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
    return;
  }
  const poppedValue = await queue.popFromQueue(req.query?.wait);
  res.status(200).json({ val: poppedValue });
});

app.use("/queue", queueRouter);

logger.info("starting app");
app.listen(3000);
