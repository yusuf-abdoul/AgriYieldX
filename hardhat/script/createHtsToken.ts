import { Client, AccountId, PrivateKey, TokenCreateTransaction, Hbar, TokenType, TokenSupplyType, TokenId } from "@hashgraph/sdk";

async function main() {
  const OPERATOR_ID = process.env.OPERATOR_ID;
  const OPERATOR_KEY = process.env.OPERATOR_KEY;

  if (!OPERATOR_ID || !OPERATOR_KEY) {
    throw new Error("Missing OPERATOR_ID or OPERATOR_KEY in environment. Set them in hardhat/.env");
  }

  // Basic token params (you can adjust names/supply)
  const NAME = process.env.HTS_TOKEN_NAME || "Hedera USDT";
  const SYMBOL = process.env.HTS_TOKEN_SYMBOL || "hUSDT";
  const DECIMALS = parseInt(process.env.HTS_TOKEN_DECIMALS || "6", 10);
  const INITIAL_SUPPLY = BigInt(process.env.HTS_INITIAL_SUPPLY || "1000000000"); // 1,000,000,000 units (pre-decimals)

  const operatorId = AccountId.fromString(OPERATOR_ID);
  const operatorKey = PrivateKey.fromStringECDSA(OPERATOR_KEY);

  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  console.log("Creating HTS token on Hedera Testnet...");
  console.log("Treasury:", operatorId.toString());
  console.log("Name/Symbol:", NAME, SYMBOL);

  // Create a fungible token, treasury = operator
  const tx = await new TokenCreateTransaction()
    .setTokenName(NAME)
    .setTokenSymbol(SYMBOL)
    .setDecimals(DECIMALS)
    .setInitialSupply(Number(INITIAL_SUPPLY))
    .setTreasuryAccountId(operatorId)
    .setTokenType(TokenType.FungibleCommon)
    .setSupplyType(TokenSupplyType.Infinite)
    .setKycKey(operatorKey.publicKey)
    .setAdminKey(operatorKey.publicKey)
    .setSupplyKey(operatorKey.publicKey)
    .setFreezeDefault(false)
    .setMaxTransactionFee(new Hbar(20))
    .freezeWith(client)
    .sign(operatorKey);

  const submit = await tx.execute(client);
  const receipt = await submit.getReceipt(client);
  const tokenId = receipt.tokenId as TokenId;
  if (!tokenId) {
    throw new Error("Token creation failed, no tokenId in receipt");
  }

  const tokenIdStr = tokenId.toString();
  const evmAddress = tokenId.toSolidityAddress();

  console.log("HTS token created.");
  console.log("Token ID:", tokenIdStr);
  console.log("EVM address:", `0x${evmAddress}`);

  // Optionally, mint some additional supply here if desired by uncommenting below
  // const mintTx = await new TokenMintTransaction()
  //   .setTokenId(tokenId)
  //   .setAmount(1000)
  //   .freezeWith(client)
  //   .sign(operatorKey);
  // await (await mintTx.execute(client)).getReceipt(client);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
