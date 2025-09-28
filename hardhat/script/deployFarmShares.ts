import { ethers } from "hardhat";

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log("Deploying FarmShares to network:", network.name);

  const deployer = (await ethers.getSigners())[0];
  console.log("Deployer address:", deployer.address);

  const FarmShares = await ethers.getContractFactory("FarmShares");
  const farmShares = await FarmShares.deploy("ipfs://");
  await farmShares.waitForDeployment();

  console.log("FarmShares deployed at:", await farmShares.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
