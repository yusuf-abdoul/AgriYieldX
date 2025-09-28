import {
  TokenCreateTransaction,
  TokenType,
  TokenMintTransaction,
  TokenAssociateTransaction,
  TokenGrantKycTransaction,
  TokenRevokeKycTransaction,
  TransferTransaction,
  PrivateKey,
  Hbar
} from "@hashgraph/sdk";
import { hederaClient } from "./hederaClient";

export async function createFungibleToken(opts: { name: string; symbol: string; decimals: number }) {
  const client = hederaClient.client;
  // using operator key as supply/admin/kyc for demo (in production, use dedicated keys)
  const supplyKey = hederaClient.operatorKey.publicKey;
  const adminKey = hederaClient.operatorKey.publicKey;
  const kycKey = hederaClient.operatorKey.publicKey;

  const tx = await new TokenCreateTransaction()
    .setTokenName(opts.name)
    .setTokenSymbol(opts.symbol)
    .setDecimals(opts.decimals)
    .setInitialSupply(0)
    .setTreasuryAccountId(hederaClient.operatorId)
    .setTokenType(TokenType.FungibleCommon)
    .setAdminKey(hederaClient.operatorKey.publicKey)
    .setKycKey(hederaClient.operatorKey.publicKey)
    .setSupplyKey(hederaClient.operatorKey.publicKey)
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const tokenId = receipt.tokenId?.toString();
  const solidityAddress = tokenId ? tokenId.toSolidityAddress() : undefined;
  return { tokenId, solidityAddress, receipt };
}

export async function associateToken(accountId: string, tokenId: string) {
  const client = hederaClient.client;
  const tx = await new TokenAssociateTransaction()
    .setAccountId(accountId)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(hederaClient.operatorKey);
  const submit = await tx.execute(client);
  const receipt = await submit.getReceipt(client);
  return { receipt };
}

export async function grantKyc(accountId: string, tokenId: string) {
  const client = hederaClient.client;
  const tx = await new TokenGrantKycTransaction()
    .setAccountId(accountId)
    .setTokenId(tokenId)
    .freezeWith(client)
    .sign(hederaClient.operatorKey);
  const submit = await tx.execute(client);
  const receipt = await submit.getReceipt(client);
  return { receipt };
}

export async function revokeKyc(accountId: string, tokenId: string) {
  const client = hederaClient.client;
  const tx = await new TokenRevokeKycTransaction()
    .setAccountId(accountId)
    .setTokenId(tokenId)
    .freezeWith(client)
    .sign(hederaClient.operatorKey);
  const submit = await tx.execute(client);
  const receipt = await submit.getReceipt(client);
  return { receipt };
}

export async function mintAndTransfer(tokenId: string, toAccountId: string, amount: number) {
  const client = hederaClient.client;
  // Mint
  const mintTx = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .setAmount(amount)
    .freezeWith(client)
    .sign(hederaClient.operatorKey);
  const mintSubmit = await mintTx.execute(client);
  const mintReceipt = await mintSubmit.getReceipt(client);

  // Transfer from treasury (operator) to target
  const transferTx = await new TransferTransaction()
    .addTokenTransfer(tokenId, hederaClient.operatorId, -amount)
    .addTokenTransfer(tokenId, toAccountId, amount)
    .freezeWith(client)
    .sign(hederaClient.operatorKey);
  const transferSubmit = await transferTx.execute(client);
  const transferReceipt = await transferSubmit.getReceipt(client);

  return { mintReceipt, transferReceipt };
}

export async function isKycEnabled(accountId: string, tokenId: string) {
  // The SDK does not have a convenience isKyc call; you can check via account/get or call mirror node.
  // For the demo, we'll attempt to call a TokenGetInfo (omitted) or assume backend tracks it.
  // Return undefined here (controller should rely on grantKyc responses)
  return undefined;
}
