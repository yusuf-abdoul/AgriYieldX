// src/routes/hcs.ts
import { Router } from "express";
import { hcsController } from "../controllers/hcsController";

const router = Router();

router.post("/createTopic", hcsController.createTopic);
router.post("/publish", hcsController.publishMessage);

export default router;
