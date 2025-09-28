import { HashConnect } from "hashconnect";
import {
  TopicMessageSubmitTransaction,
  TopicId,
  Client,
} from "@hashgraph/sdk";

const MIRROR_WS = "wss://testnet.mirrornode.hedera.com/api/v1/topics";

class HcsService {
  constructor(hashconnect, operatorId, operatorKey) {
    this.hashconnect = hashconnect;
    this.client = Client.forTestnet();

    if (operatorId && operatorKey) {
      // Optional: backend operator for system messages
      this.client.setOperator(operatorId, operatorKey);
    }
  }

  /**
   * Subscribe to topic (real-time via Mirror Node WebSocket)
   */
  subscribeToTopic(topicId, onMessage) {
    const ws = new WebSocket(`${MIRROR_WS}/${topicId}/messages/stream`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const message = atob(data.message); // decode base64
      onMessage(message);
    };
    ws.onerror = (err) => console.error("HCS WS Error:", err);
    return ws;
  }

  /**
   * Send a message to a topic (signed by user's wallet via HashPack)
   */
  async sendMessage(topicId, message, signer) {
    const tx = new TopicMessageSubmitTransaction({
      topicId: TopicId.fromString(topicId),
      message,
    }).freezeWithSigner(signer);

    const res = await tx.executeWithSigner(signer);
    return res;
  }
}

export const hcsService = new HcsService(new HashConnect());
