import * as tokenService from "./tokenService";

const lastClaim = new Map<string, number>();
const DEFAULT_AMOUNT = 1_000 * 10 ** 6; // 1000 * 10^6

export const faucetService = {
  async claim(opts: { accountId: string; tokenId: string; amount?: number }) {
    const { accountId, tokenId, amount } = opts;
    const now = Date.now();
    const prev = lastClaim.get(accountId) ?? 0;
    if (now - prev < 24 * 60 * 60 * 1000) {
      throw new Error("Faucet: claimed within 24h");
    }
    lastClaim.set(accountId, now);

    // Mint & transfer
    const amt = amount ?? DEFAULT_AMOUNT;
    const r = await tokenService.mintAndTransfer(tokenId, accountId, amt);
    return { minted: amt, receipt: r };
  },
};
