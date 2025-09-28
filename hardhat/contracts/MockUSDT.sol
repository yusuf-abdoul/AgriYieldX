// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// Hedera Token Service interface
interface IHederaTokenService {
    function createFungibleToken(
        string memory name,
        string memory symbol,
        string memory memo,
        int64 maxSupply,
        int32 decimals,
        bool freezeDefaultStatus,
        bytes[] memory metadata
    ) external payable returns (int, address);

    function mintToken(
        address token,
        int64 amount,
        bytes[] memory metadata
    ) external returns (int);
    function transferToken(
        address token,
        address from,
        address to,
        int64 amount
    ) external returns (int);
    function grantTokenKyc(
        address token,
        address account
    ) external returns (int);
    function revokeTokenKyc(
        address token,
        address account
    ) external returns (int);
}

// Hedera Response Codes
library HederaResponseCodes {
    int constant SUCCESS = 22;
    int constant ACCOUNT_KYC_NOT_GRANTED_FOR_TOKEN = 44;
}

// Key Helper interface
interface IKeyHelper {
    function getSingleKey(
        uint8 keyType,
        uint8 keyValueType,
        address key
    ) external pure returns (bytes memory);
}

contract MockUSDT is Ownable {
    // Hedera HTS precompile address and instance
    address constant HTS_PRECOMPILE_ADDR = address(uint160(0x167));
    IHederaTokenService constant HTS = IHederaTokenService(HTS_PRECOMPILE_ADDR);
    address public tokenAddress;

    string public constant name = "Hedera USD Tether";
    string public constant symbol = "hUSDT";
    uint8 public constant decimals = 6;

    mapping(address => uint256) public lastClaim;
    uint256 public faucetAmount = 1_000 * 10 ** 6;
    uint256 public faucetCooldown = 1 days;

    event FungibleCreated(address indexed token);
    event FaucetClaimed(address indexed user, uint256 amount);
    event KYCGranted(address indexed account);
    event KYCRevoked(address indexed account);

    constructor() Ownable(msg.sender) {}

    function createFungibleToken() external payable onlyOwner {
        require(tokenAddress == address(0), "Already initialized");

        // For this mock implementation, we'll create a simple token
        // In a real implementation, this would call the Hedera Token Service
        bytes[] memory metadata = new bytes[](0);

        (int rc, address created) = HTS.createFungibleToken(
            name,
            symbol,
            "Mock USDT for testing",
            int64(type(int64).max),
            int32(uint32(decimals)),
            false,
            metadata
        );
        require(
            rc == HederaResponseCodes.SUCCESS,
            "HTS: create fungible failed"
        );

        tokenAddress = created;

        int rcTreasuryKyc = HTS.grantTokenKyc(tokenAddress, address(this));
        require(
            rcTreasuryKyc == HederaResponseCodes.SUCCESS,
            "HTS: treasury KYC failed"
        );

        emit FungibleCreated(created);
    }

    function faucet(address to) external {
        require(tokenAddress != address(0), "Not created");
        require(
            block.timestamp - lastClaim[to] >= faucetCooldown,
            "Cooldown active"
        );

        lastClaim[to] = block.timestamp;

        bytes[] memory metadata = new bytes[](0);
        int rc = HTS.mintToken(
            tokenAddress,
            int64(int256(faucetAmount)),
            metadata
        );
        require(rc == HederaResponseCodes.SUCCESS, "HTS: mint failed");

        int transferRc = HTS.transferToken(
            tokenAddress,
            address(this),
            to,
            int64(int256(faucetAmount))
        );
        require(
            transferRc == HederaResponseCodes.SUCCESS,
            "HTS: transfer failed"
        );

        emit FaucetClaimed(to, faucetAmount);
    }

    function grantKYC(address account) external onlyOwner {
        require(tokenAddress != address(0), "Not created");
        int response = HTS.grantTokenKyc(tokenAddress, account);
        require(
            response == HederaResponseCodes.SUCCESS,
            "HTS: grant KYC failed"
        );
        emit KYCGranted(account);
    }

    function revokeKYC(address account) external onlyOwner {
        require(tokenAddress != address(0), "Not created");
        int response = HTS.revokeTokenKyc(tokenAddress, account);
        require(
            response == HederaResponseCodes.SUCCESS ||
                response ==
                HederaResponseCodes.ACCOUNT_KYC_NOT_GRANTED_FOR_TOKEN,
            "HTS: revoke KYC failed"
        );
        emit KYCRevoked(account);
    }
}
