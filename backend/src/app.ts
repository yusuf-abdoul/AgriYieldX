import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import kycRoutes from "./routes/kyc";
import faucetRoutes from "./routes/faucet";
import adminRoutes from "./routes/admin";
import ipfsRoutes from "./routes/ipfs";
import hcsRoutes from "./routes/hcs";

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});

// Faucet specific rate limiting (more restrictive)
const faucetLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 1, // limit each IP to 1 request per day
    message: "Faucet can only be claimed once per day."
});

app.use(limiter);
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// routes
app.use("/api/kyc", kycRoutes);
app.use("/api/faucet", faucetLimiter, faucetRoutes); // Apply faucet rate limiting
app.use("/api/admin", adminRoutes);
app.use("/api/ipfs", ipfsRoutes);
app.use("/api/hcs", hcsRoutes);

// basic health
app.get("/", (req, res) => res.json({ ok: true, service: "AgriYield backend" }));

export default app;
