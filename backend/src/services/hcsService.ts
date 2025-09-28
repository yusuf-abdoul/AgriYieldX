import { Client, TopicCreateTransaction, TopicMessageSubmitTransaction, TopicId } from "@hashgraph/sdk";
import { hederaClient } from "./hederaClient";

export async function createTopic() {
    const client = hederaClient.client;
    const tx = await new TopicCreateTransaction().execute(client);
    const receipt = await tx.getReceipt(client);
    return receipt.topicId?.toString();
}

export async function publishMessage(topicId: string, message: string) {
    const client = hederaClient.client;
    const tx = await new TopicMessageSubmitTransaction({
        topicId: TopicId.fromString(topicId),
        message,
    }).execute(client);
    return tx.transactionId.toString();
}

