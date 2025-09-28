// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Hedera HTS precompile imports - using interface for now
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Hedera Token Service interface
interface IHederaTokenService {
    function transferToken(
        address token,
        address from,
        address to,
        int64 amount
    ) external returns (int);
    function mintToken(
        address token,
        int64 amount,
        bytes[] memory metadata
    ) external returns (int);
    function isKyc(
        address token,
        address account
    ) external view returns (int, bool);
}

// Hedera Response Codes
library HederaResponseCodes {
    int constant SUCCESS = 22;
}

import "./FarmShares.sol";

/// @title AgriYield - Crowdfunding manager for agricultural farms
/// @notice Handles farm creation, investments, disbursements, and investor payouts
contract AgriYield is ReentrancyGuard {
    // Hedera HTS precompile address and instance
    address constant HTS_PRECOMPILE_ADDR = address(uint160(0x167));
    IHederaTokenService constant HTS = IHederaTokenService(HTS_PRECOMPILE_ADDR);
    FarmShares public farmShares;
    address public immutable tokenAddress; // HTS fungible token (MockUSDT)
    address public immutable admin;

    enum Status {
        Active,
        Funded,
        PaidOut,
        Settled
    }

    struct Farm {
        address farmer;
        uint256 fundingGoal;
        uint256 raised;
        uint256 proceeds; // deposits after harvest
        uint256 shareSupply;
        uint256 sharePrice;
        Status status;
        string metaCID; // IPFS metadata
    }

    uint256 public farmCount;
    mapping(uint256 => Farm) public farms;
    mapping(uint256 => mapping(address => uint256)) public investorShares;

    /// ---------------- Events ----------------
    event FarmCreated(
        uint256 indexed farmId,
        address indexed farmer,
        string metaCID
    );
    event Invested(
        uint256 indexed farmId,
        address indexed investor,
        uint256 amount,
        uint256 shares
    );
    event FundsDisbursed(uint256 indexed farmId, uint256 amount);
    event ProceedsDeposited(uint256 indexed farmId, uint256 amount);
    event InvestorClaimed(
        uint256 indexed farmId,
        address indexed investor,
        uint256 payout
    );

    constructor(address _farmShares, address _tokenAddress, address _admin) {
        require(
            _farmShares != address(0) &&
                _tokenAddress != address(0) &&
                _admin != address(0),
            "AgriYield: zero addr"
        );
        farmShares = FarmShares(_farmShares);
        tokenAddress = _tokenAddress;
        admin = _admin;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "AgriYield: only admin");
        _;
    }

    /// @notice Creates a new farm campaign
    function createFarm(
        uint256 fundingGoal,
        uint256 shareSupply,
        uint256 sharePrice,
        string memory metaCID
    ) external returns (uint256) {
        require(
            fundingGoal > 0 && shareSupply > 0 && sharePrice > 0,
            "AgriYield: invalid args"
        );
        require(
            fundingGoal == shareSupply * sharePrice,
            "AgriYield: goal mismatch"
        );

        farmCount++;
        uint256 id = farmCount;

        farms[id] = Farm({
            farmer: msg.sender,
            fundingGoal: fundingGoal,
            raised: 0,
            proceeds: 0,
            shareSupply: shareSupply,
            sharePrice: sharePrice,
            status: Status.Active,
            metaCID: metaCID
        });

        // Mint ERC1155 shares to AgriYield contract as "vault"
        farmShares.mintShares(address(this), id, shareSupply);

        // Store metadata in FarmShares
        farmShares.setFarmMetadata(id, metaCID);

        emit FarmCreated(id, msg.sender, metaCID);
        return id;
    }

    /// @notice Invest USDT into a farm in exchange for ERC1155 shares
    function invest(uint256 farmId, uint256 amount) external nonReentrant {
        Farm storage f = farms[farmId];
        require(f.status == Status.Active, "AgriYield: not active");
        require(
            amount > 0 && amount % f.sharePrice == 0,
            "AgriYield: bad amount"
        );

        // KYC check - for now, skip in mock implementation
        // (int rc, bool en) = IHederaTokenService(0x167).isKyc(tokenAddress, msg.sender);
        // require(rc == HederaResponseCodes.SUCCESS && en, "AgriYield: KYC required");

        uint256 sharesToBuy = amount / f.sharePrice;
        require(
            sharesToBuy <= f.shareSupply - (f.raised / f.sharePrice),
            "AgriYield: not enough shares"
        );

        // Transfer stablecoin (MockUSDT) to contract
        int tr = HTS.transferToken(
            tokenAddress,
            msg.sender,
            address(this),
            int64(int256(amount))
        );
        require(
            tr == HederaResponseCodes.SUCCESS,
            "AgriYield: token transfer failed"
        );

        f.raised += amount;
        investorShares[farmId][msg.sender] += sharesToBuy;

        // Send ERC1155 shares
        farmShares.safeTransferFrom(
            address(this),
            msg.sender,
            farmId,
            sharesToBuy,
            ""
        );

        if (f.raised >= f.fundingGoal) {
            f.status = Status.Funded;
        }

        emit Invested(farmId, msg.sender, amount, sharesToBuy);
    }

    /// @notice Disburse raised funds to farmer after funding goal is reached
    function disburseFunds(uint256 farmId) external nonReentrant {
        Farm storage f = farms[farmId];
        require(f.status == Status.Funded, "AgriYield: not funded");
        require(
            msg.sender == f.farmer || msg.sender == admin,
            "AgriYield: not allowed"
        );

        uint256 amount = f.raised;
        f.raised = 0; // prevent re-use
        f.status = Status.PaidOut;

        int tr = HTS.transferToken(
            tokenAddress,
            address(this),
            f.farmer,
            int64(int256(amount))
        );
        require(tr == HederaResponseCodes.SUCCESS, "AgriYield: payout failed");

        emit FundsDisbursed(farmId, amount);
    }

    /// @notice Farmer deposits harvest proceeds back into the pool
    function depositProceeds(uint256 farmId, uint256 amount) external {
        Farm storage f = farms[farmId];
        require(msg.sender == f.farmer, "AgriYield: only farmer");
        require(amount > 0, "AgriYield: amount > 0");

        int tr = HTS.transferToken(
            tokenAddress,
            msg.sender,
            address(this),
            int64(int256(amount))
        );
        require(tr == HederaResponseCodes.SUCCESS, "AgriYield: deposit failed");

        f.proceeds += amount;
        if (f.proceeds >= f.fundingGoal) {
            f.status = Status.Settled;
        }

        emit ProceedsDeposited(farmId, amount);
    }

    /// @notice Investors claim proportional payout after settlement
    function claimInvestorPayout(uint256 farmId) external nonReentrant {
        Farm storage f = farms[farmId];
        require(f.status == Status.Settled, "AgriYield: not settled");

        uint256 shares = investorShares[farmId][msg.sender];
        require(shares > 0, "AgriYield: no shares");

        uint256 totalShares = f.shareSupply;
        uint256 totalProceeds = f.proceeds;
        uint256 entitlement = (totalProceeds * shares) / totalShares;

        investorShares[farmId][msg.sender] = 0;

        // Burn ERC1155 shares
        farmShares.burnShares(msg.sender, farmId, shares);

        int tr = HTS.transferToken(
            tokenAddress,
            address(this),
            msg.sender,
            int64(int256(entitlement))
        );
        require(
            tr == HederaResponseCodes.SUCCESS,
            "AgriYield: payout transfer failed"
        );

        emit InvestorClaimed(farmId, msg.sender, entitlement);
    }

    function getFarm(uint256 farmId) external view returns (Farm memory) {
        return farms[farmId];
    }
}
