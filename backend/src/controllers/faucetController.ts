import { Request, Response } from "express";
import { faucetService } from "../services/faucetService";

export async function claimFaucet(req: Request, res: Response) {
  try {
    const { accountId, tokenId, amount } = req.body;

    // Input validation
    if (!accountId || typeof accountId !== 'string') {
      return res.status(400).json({ error: "Valid accountId required" });
    }
    if (!tokenId || typeof tokenId !== 'string') {
      return res.status(400).json({ error: "Valid tokenId required" });
    }
    if (amount && (isNaN(Number(amount)) || Number(amount) <= 0)) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    // Validate accountId format (basic Hedera account ID format)
    if (!/^0\.0\.\d+$/.test(accountId)) {
      return res.status(400).json({ error: "Invalid accountId format" });
    }

    const result = await faucetService.claim({
      accountId,
      tokenId,
      amount: amount ? Number(amount) : undefined
    });
    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? String(err) });
  }
}
