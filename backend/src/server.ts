// import express from "express";
// import bodyParser from "body-parser";
// import sqlite3 from "sqlite3";
// import { open } from "sqlite";
// import { Client, AccountId, PrivateKey, TokenAssociateTransaction, TokenGrantKycTransaction } from "@hashgraph/sdk";
// import dotenv from "dotenv";

// dotenv.config();
// const app = express();
// app.use(bodyParser.json());

// // Setup SQLite
// let db;
// (async () => {
//   db = await open({
//     filename: "./kyc.db",
//     driver: sqlite3.Database
//   });
//   await db.exec("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, kyc INTEGER)");
// })();

// // Hedera client (admin account)
// const client = Client.forTestnet();
// client.setOperator(
//   AccountId.fromString(process.env.ADMIN_ID),
//   PrivateKey.fromStringECDSA(process.env.ADMIN_KEY)
// );

// // POST /kyc/approve
// app.post("/kyc/approve", async (req, res) => {
//   const { evmAddress, tokenId } = req.body;
//   if (!evmAddress || !tokenId) return res.status(400).json({ error: "Missing params" });

//   try {
//     // Associate token
//     const assocTx = await new TokenAssociateTransaction()
//       .setAccountId(evmAddress)
//       .setTokenIds([tokenId])
//       .freezeWith(client)
//       .sign(PrivateKey.fromStringECDSA(process.env.ADMIN_KEY));
//     await assocTx.execute(client);

//     // Grant KYC
//     const kycTx = await new TokenGrantKycTransaction()
//       .setAccountId(evmAddress)
//       .setTokenId(tokenId)
//       .freezeWith(client)
//       .sign(PrivateKey.fromStringECDSA(process.env.ADMIN_KEY));
//     await kycTx.execute(client);

//     await db.run("INSERT OR REPLACE INTO users (id, kyc) VALUES (?, ?)", [evmAddress, 1]);

//     res.json({ success: true, evmAddress });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "KYC approval failed" });
//   }
// });

// // GET /kyc/status/:id
// app.get("/kyc/status/:id", async (req, res) => {
//   const row = await db.get("SELECT * FROM users WHERE id = ?", [req.params.id]);
//   res.json(row || { kyc: 0 });
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));

import "dotenv/config";
import app from "./app";
import { initHedera } from "./services/hederaClient";

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

(async () => {
  await initHedera(); // sets up client singleton
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
})();
