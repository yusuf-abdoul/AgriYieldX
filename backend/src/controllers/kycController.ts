import { Request, Response } from "express";
import * as tokenService from "../services/tokenService";

export async function checkKycStatus(req: Request, res: Response) {
  try {
    const { token, accountId } = req.params;
    if (!token || !accountId) return res.status(400).json({ error: "token and accountId required" });
    const status = await tokenService.isKycEnabled(accountId, token);
    res.json({ accountId, token, kyc: status });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? String(err) });
  }
}
