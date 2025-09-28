import {
    Client,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    TokenId
  } from "@hashgraph/sdk";
  
  const client = Client.forTestnet();
  client.setOperator(process.env.OPERATOR_ACCOUNT_ID, process.env.OPERATOR_PRIVATE_KEY);
  
  // Create fungible token (no fixed supply)
  const transaction = await new TokenCreateTransaction()
    .setTokenName("Hedera USD Tether")
    .setTokenSymbol("hUSDT")
    .setDecimals(6)
    .setInitialSupply(0) // no initial supply
    .setTokenType(TokenType.FungibleCommon)
    .setSupplyType(TokenSupplyType.Infinite)
    // set treasury to operator (or other admin account)
    .setTreasuryAccountId(process.env.OPERATOR_ACCOUNT_ID)
    // set keys (supplyKey, kycKey) using operator private key or better a dedicated key
    .setSupplyKey(process.env.OPERATOR_PUBLIC_KEY)
    .setKycKey(process.env.OPERATOR_PUBLIC_KEY)
    .freezeWith(client);
  
  // sign and submit with supply/kyc keys
  const signed = await transaction.sign(process.env.OPERATOR_PRIVATE_KEY);
  const txResponse = await signed.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const tokenId = receipt.tokenId; // TokenId object
  console.log("Created token:", tokenId.toString());
  