import { Router } from "express";
import { createToken, associate, grantKyc, revokeKyc } from "../controllers/adminController";

const router = Router();

// create token (admin only) - POST body { name, symbol, decimals }
router.post("/createToken", createToken);

// associate account with token - POST body { accountId, tokenId }
router.post("/associate", associate);

// grant/revoke kyc - POST body { accountId, tokenId }
router.post("/grantKyc", grantKyc);
router.post("/revokeKyc", revokeKyc);

export default router;
