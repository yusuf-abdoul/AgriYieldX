import { expect } from "chai";
import { ethers } from "hardhat";

describe("MockUSDT", function () {
  it.skip("Should deploy and allow faucet claim", async function () {
    const [owner, user] = await ethers.getSigners();

    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const usdt = await MockUSDT.deploy();
    await usdt.waitForDeployment();

    const addr = await usdt.getAddress();
    console.log("Deployed MockUSDT:", addr);

    // Create token first
    await usdt.createFungibleToken();

    // Claim faucet
    await usdt.connect(user).faucet(user.address);
    const balance = await usdt.balanceOf(user.address);

    expect(balance).to.be.gt(0);
  });
});
