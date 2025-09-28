import { ethers } from "hardhat";

async function main() {
  const addr = process.env.MOCK_USDT_ADDRESS as string | undefined;
  if (!addr) {
    throw new Error("Missing MOCK_USDT_ADDRESS in environment. Set it in hardhat/.env or inline before running.");
  }

  const [signer] = await ethers.getSigners();
  console.log("Initializer (owner) address:", await signer.getAddress());
  console.log("Attaching to MockUSDT at:", addr);

  const mockUsdt = await ethers.getContractAt("MockUSDT", addr);

  // Check if already initialized
  const currentToken = await mockUsdt.tokenAddress();
  if (currentToken && currentToken !== ethers.ZeroAddress) {
    console.log("MockUSDT already initialized. tokenAddress:", currentToken);
    return;
  }

  console.log("Calling createFungibleToken() on MockUSDT...");
  const tx = await mockUsdt.createFungibleToken();
  const receipt = await tx.wait();
  console.log("createFungibleToken() tx mined in block:", receipt?.blockNumber);

  const newToken = await mockUsdt.tokenAddress();
  console.log("Initialized MockUSDT tokenAddress:", newToken);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
