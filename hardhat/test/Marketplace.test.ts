import { expect } from "chai";
import { ethers } from "hardhat";

describe("Marketplace", function () {
  it("Should deploy successfully", async function () {
    const [owner] = await ethers.getSigners();

    // Mock addresses for testing
    const mockTokenAddress = ethers.Wallet.createRandom().address;
    const mockAgriYieldAddress = ethers.Wallet.createRandom().address;

    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(mockTokenAddress, mockAgriYieldAddress);
    await marketplace.waitForDeployment();

    expect(await marketplace.getAddress()).to.be.properAddress;
  });
});
