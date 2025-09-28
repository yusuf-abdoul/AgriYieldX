// src/controllers/hcsController.ts
import { Request, Response } from "express";
import * as hcsService from "../services/hcsService";

export const hcsController = {
  async createTopic(req: Request, res: Response) {
    try {
      const topicId = await hcsService.createTopic();
      res.json({ topicId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create topic" });
    }
  },

  async publishMessage(req: Request, res: Response) {
    try {
      const { topicId, message } = req.body;
      if (!topicId || !message) {
        return res.status(400).json({ error: "topicId and message required" });
      }
      const txId = await hcsService.publishMessage(topicId, message);
      res.json({ txId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to publish message" });
    }
  },
};
