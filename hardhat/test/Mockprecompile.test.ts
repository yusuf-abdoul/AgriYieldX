import { expect } from "chai";
import { ethers } from "hardhat";

describe("MockHederaPrecompile", function () {
  it("mint, grantKyc, transfer and isKyc", async function () {
    const [a, b] = await ethers.getSigners();
    const Mock = await ethers.getContractFactory("MockHederaPrecompile");
    const mock = await Mock.deploy();
    await mock.waitForDeployment();

    const tokenAddress = ethers.Wallet.createRandom().address;
    await mock.mintToken(tokenAddress, 1000);
    await mock.setBalance(tokenAddress, a.address, 500);
    expect((await mock.balanceOf(tokenAddress, a.address)).toString()).to.equal('500');

    await mock.grantTokenKyc(tokenAddress, a.address);
    const [code, enabled] = await mock.isKyc(tokenAddress, a.address);
    expect(enabled).to.equal(true);

    await mock.setBalance(tokenAddress, a.address, 600);
    await mock.transferToken(tokenAddress, a.address, b.address, 100);
    expect((await mock.balanceOf(tokenAddress, b.address)).toString()).to.equal('100');
  });
});
