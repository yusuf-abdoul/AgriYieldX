import { ethers } from "hardhat";

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log("Deploying to network:", network.name);

  // Use the first signer
  const deployer = (await ethers.getSigners())[0];
  console.log("Deployer address:", await deployer.getAddress());

  // Read required addresses from environment (Hardhat run does not support positional args reliably)
  const farmSharesAddr = process.env.FARM_SHARES_ADDRESS as string | undefined;
  const tokenAddr = process.env.MOCK_USDT_ADDRESS as string | undefined;
  const admin = process.env.ADMIN_EVM_ADDRESS as string | undefined;
  if (!farmSharesAddr || !tokenAddr || !admin) {
    throw new Error(
      "Missing env vars. Please set FARM_SHARES_ADDRESS, MOCK_USDT_ADDRESS, ADMIN_EVM_ADDRESS before running this script."
    );
  }

  // Determine precompile address
  let precompileAddr: string;
  if (network.name === "hardhat") {
    // Expect a mock precompile to be deployed locally
    // Either hardcode after deploying mock or deploy it here
    console.log("Using local mock precompile for Hardhat");
    const MockPrecompile = await ethers.getContractFactory("MockHederaPrecompile");
    const mock = await MockPrecompile.deploy();
    await mock.waitForDeployment();
    precompileAddr = await mock.getAddress();
    console.log("Mock precompile deployed at:", precompileAddr);
  } else {
    // Hedera testnet/mainnet
    precompileAddr = "0x167";
    console.log("Using Hedera HTS precompile at:", precompileAddr);
  }

  const AgriYield = await ethers.getContractFactory("AgriYield");
  const ag = await AgriYield.deploy(farmSharesAddr, tokenAddr, admin);
  await ag.waitForDeployment();

  console.log("AgriYield deployed at:", await ag.getAddress());

  // Transfer ownership of FarmShares to AgriYield
  const farmShares = (await ethers.getContractAt("FarmShares", farmSharesAddr)) as any;
  await farmShares.setAgriYield(await ag.getAddress());
  console.log("FarmShares ownership transferred to AgriYield");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
