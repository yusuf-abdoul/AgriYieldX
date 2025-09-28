import { Request, Response } from "express";
import * as tokenService from "../services/tokenService";

export async function createToken(req: Request, res: Response) {
  try {
    const { name, symbol, decimals } = req.body;

    // Input validation
    if (name && (typeof name !== 'string' || name.length > 100)) {
      return res.status(400).json({ error: "Name must be a string with max 100 characters" });
    }
    if (symbol && (typeof symbol !== 'string' || symbol.length > 10)) {
      return res.status(400).json({ error: "Symbol must be a string with max 10 characters" });
    }
    if (decimals && (isNaN(Number(decimals)) || Number(decimals) < 0 || Number(decimals) > 18)) {
      return res.status(400).json({ error: "Decimals must be a number between 0 and 18" });
    }

    const token = await tokenService.createFungibleToken({
      name: name ?? "Hedera USD Tether",
      symbol: symbol ?? "hUSDT",
      decimals: Number(decimals ?? 6),
    });
    res.json(token);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? String(err) });
  }
}

export async function associate(req: Request, res: Response) {
  try {
    const { accountId, tokenId } = req.body;

    // Input validation
    if (!accountId || typeof accountId !== 'string' || !/^0\.0\.\d+$/.test(accountId)) {
      return res.status(400).json({ error: "Valid accountId required" });
    }
    if (!tokenId || typeof tokenId !== 'string') {
      return res.status(400).json({ error: "Valid tokenId required" });
    }

    const result = await tokenService.associateToken(accountId, tokenId);
    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? String(err) });
  }
}

export async function grantKyc(req: Request, res: Response) {
  try {
    const { accountId, tokenId } = req.body;

    // Input validation
    if (!accountId || typeof accountId !== 'string' || !/^0\.0\.\d+$/.test(accountId)) {
      return res.status(400).json({ error: "Valid accountId required" });
    }
    if (!tokenId || typeof tokenId !== 'string') {
      return res.status(400).json({ error: "Valid tokenId required" });
    }

    const result = await tokenService.grantKyc(accountId, tokenId);
    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? String(err) });
  }
}

export async function revokeKyc(req: Request, res: Response) {
  try {
    const { accountId, tokenId } = req.body;

    // Input validation
    if (!accountId || typeof accountId !== 'string' || !/^0\.0\.\d+$/.test(accountId)) {
      return res.status(400).json({ error: "Valid accountId required" });
    }
    if (!tokenId || typeof tokenId !== 'string') {
      return res.status(400).json({ error: "Valid tokenId required" });
    }

    const result = await tokenService.revokeKyc(accountId, tokenId);
    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? String(err) });
  }
}
