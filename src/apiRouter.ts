import express from "express";
import { body, validationResult } from "express-validator";
import { isString } from "util";

import ApiKeyStore from "./ApiKeyStore";
import redisClient from "./db";

const apiKeyStore = new ApiKeyStore(redisClient);

const checkApiKey = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const apiKey = req.headers.apikey;
  if (!apiKey || !isString(apiKey)) {
    res.status(401).json({ message: "apiKey missing from header" });
    return;
  }
  const apiKeyExists = await apiKeyStore.checkApiKey(apiKey);
  if (!apiKeyExists) {
    res.status(401).json({ message: "apiKey invalid" });
    return;
  }
  apiKeyStore.incrementCounter(apiKey);
  next();
};

const router = express.Router();

router.get("/:apiKey", checkApiKey, async (req, res) => {
  const apiKey = await apiKeyStore.getName(req.params.apiKey);
  res.status(200).json({ name: apiKey });
});

router.post(
  "",
  body("name").exists().isString(),
  body("apiKey").exists().isString(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
      return;
    }
    apiKeyStore.putKey(req.body.apiKey, req.body.name);
    res.status(200).json({ message: "api key saved" });
  }
);

export default router;
