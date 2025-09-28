// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IHederaPrecompile.sol";

contract MockHederaPrecompile is IHederaPrecompile {
    // simple success code
    int constant SUCCESS = 22; // arbitrary "SUCCESS" constant used by HederaResponseCodes in examples

    mapping(address => mapping(address => uint256)) public balances; // token => (acct => bal)
    mapping(address => mapping(address => bool)) public kyc; // token => (acct => bool)
    mapping(address => uint64) public totalSupply; // token => supply

    // mintToken mints into the precompile's treasury (we'll assume token contract address itself acts as "treasury")
    function mintToken(address token, uint64 amount) external override returns (int) {
        totalSupply[token] += amount;
        // mint to token address as treasury
        balances[token][token] += amount;
        return SUCCESS;
    }

    function transferToken(address token, address from, address to, uint64 amount) external override returns (int) {
        require(balances[token][from] >= amount, "MockPrecompile: insufficient balance");
        balances[token][from] -= amount;
        balances[token][to] += amount;
        return SUCCESS;
    }

    function grantTokenKyc(address token, address account) external override returns (int) {
        kyc[token][account] = true;
        return SUCCESS;
    }

    function revokeTokenKyc(address token, address account) external override returns (int) {
        kyc[token][account] = false;
        return SUCCESS;
    }

    function isKyc(address token, address account) external view override returns (int, bool) {
        bool enabled = kyc[token][account];
        return (SUCCESS, enabled);
    }

    // helper for tests to set initial balance
    function setBalance(address token, address account, uint256 amount) external {
        balances[token][account] = amount;
    }

    function balanceOf(address token, address account) external view returns (uint256) {
        return balances[token][account];
    }
}
