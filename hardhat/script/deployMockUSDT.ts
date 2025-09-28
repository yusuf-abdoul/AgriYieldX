import { ethers } from "hardhat";

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log("Deploying MockUSDT to network:", network.name);

  const deployer = (await ethers.getSigners())[0];
  console.log("Deployer address:", deployer.address);

  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUsdt = await MockUSDT.deploy();
  await mockUsdt.waitForDeployment();

  console.log("MockUSDT deployed at:", await mockUsdt.getAddress());
}

main().catch((e) => { 
  console.error(e); 
  process.exitCode = 1; 
});
