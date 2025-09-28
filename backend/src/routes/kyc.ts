import { Router } from "express";
import { checkKycStatus } from "../controllers/kycController";

const router = Router();

// GET /api/kyc/status/:tokenId/:accountId
router.get("/status/:token/:accountId", checkKycStatus);

export default router;
