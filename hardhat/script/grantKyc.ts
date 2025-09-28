import { Client, AccountId, PrivateKey, TokenId, TokenGrantKycTransaction, Hbar } from "@hashgraph/sdk";

async function main() {
  const OPERATOR_ID = process.env.OPERATOR_ID;
  const OPERATOR_KEY = process.env.OPERATOR_KEY;
  const TOKEN_ID = process.env.TOKEN_ID;
  const ACCOUNTS_CSV = process.env.KYC_ACCOUNT_IDS; // comma-separated Hedera account IDs, e.g. "0.0.111,0.0.222"

  if (!OPERATOR_ID || !OPERATOR_KEY) throw new Error("Missing OPERATOR_ID or OPERATOR_KEY in environment.");
  if (!TOKEN_ID) throw new Error("Missing TOKEN_ID in environment (e.g. 0.0.xxxxxx).");
  if (!ACCOUNTS_CSV) throw new Error("Missing KYC_ACCOUNT_IDS in environment (comma-separated Hedera account IDs).");

  const operatorId = AccountId.fromString(OPERATOR_ID);
  // Use ECDSA if your key is ECDSA (HashPack typically uses ECDSA). If Ed25519, use fromString instead.
  const operatorKey = PrivateKey.fromStringECDSA(OPERATOR_KEY);
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  const tokenId = TokenId.fromString(TOKEN_ID);
  const accounts = ACCOUNTS_CSV.split(",").map((s) => s.trim()).filter(Boolean);

  console.log("Granting KYC for token", tokenId.toString(), "to accounts:", accounts);

  for (const accStr of accounts) {
    const accountId = AccountId.fromString(accStr);
    console.log("Granting KYC ->", accountId.toString());

    const tx = await new TokenGrantKycTransaction()
      .setAccountId(accountId)
      .setTokenId(tokenId)
      .setMaxTransactionFee(new Hbar(10))
      .freezeWith(client)
      .sign(operatorKey);

    const resp = await tx.execute(client);
    const receipt = await resp.getReceipt(client);
    console.log("Status:", receipt.status.toString());
  }

  console.log("Done granting KYC.");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
