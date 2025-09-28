// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IHederaPrecompile {
    // mimic the int return codes used by HederaResponseCodes
    function transferToken(address token, address from, address to, uint64 amount) external returns (int);
    function mintToken(address token, uint64 amount) external returns (int);
    function grantTokenKyc(address token, address account) external returns (int);
    function revokeTokenKyc(address token, address account) external returns (int);
    function isKyc(address token, address account) external view returns (int, bool);
}
