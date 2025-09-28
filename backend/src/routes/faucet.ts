import { Router } from "express";
import { claimFaucet } from "../controllers/faucetController";

const router = Router();

// POST /api/faucet/claim  { accountId, amount? }
// amount optional, default in config
router.post("/claim", claimFaucet);

export default router;
