import { Client, PrivateKey } from "@hashgraph/sdk";

let hederaClient: {
  client: Client;
  operatorId: string;
  operatorKey: PrivateKey;
  operatorPublicKey: string;
};

export async function initHedera() {
  const network = process.env.HEDERA_NETWORK || "testnet";
  const operatorId = process.env.OPERATOR_ID;
  const operatorKeyStr = process.env.OPERATOR_KEY;

  if (!operatorId || !operatorKeyStr) {
    throw new Error("Missing OPERATOR_ID or OPERATOR_KEY in env");
  }

  const operatorKey = PrivateKey.fromString(operatorKeyStr);
  const client = Client.forName(network);
  client.setOperator(operatorId, operatorKey);

  hederaClient = {
    client,
    operatorId,
    operatorKey,
    operatorPublicKey: operatorKey.publicKey.toStringDer(),
  };

  console.log(`Initialized Hedera client for ${network} operator ${operatorId}`);
}

export { hederaClient };
