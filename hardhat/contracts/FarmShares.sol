// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice ERC1155 Farm share tokens. Each farm uses its farmId as token id.
/// @dev Ownership is transferred to AgriYield after deployment.
contract FarmShares is ERC1155, Ownable {
    mapping(uint256 => string) private _farmCid;
    address public agriYield;

    event FarmMetadataSet(uint256 indexed farmId, string cid);
    event SharesMinted(
        uint256 indexed farmId,
        address indexed to,
        uint256 amount
    );
    event SharesBurned(
        uint256 indexed farmId,
        address indexed from,
        uint256 amount
    );
    event AgriYieldSet(address indexed newAgriYield);

    constructor(string memory baseURI) ERC1155(baseURI) Ownable(msg.sender) {}

    modifier onlyAgriYield() {
        require(msg.sender == agriYield, "FarmShares: only AgriYield");
        _;
    }

    function setAgriYield(address newAgriYield) external onlyOwner {
        require(newAgriYield != address(0), "FarmShares: zero address");
        agriYield = newAgriYield;
        emit AgriYieldSet(newAgriYield);
    }

    function mintShares(
        address to,
        uint256 farmId,
        uint256 amount
    ) external onlyAgriYield {
        _mint(to, farmId, amount, "");
        emit SharesMinted(farmId, to, amount);
    }

    function burnShares(
        address from,
        uint256 farmId,
        uint256 amount
    ) external onlyAgriYield {
        _burn(from, farmId, amount);
        emit SharesBurned(farmId, from, amount);
    }

    function setFarmMetadata(uint256 farmId, string memory cid) external {
        require(
            msg.sender == owner() || msg.sender == agriYield,
            "FarmShares: not authorized"
        );
        _farmCid[farmId] = cid;
        emit FarmMetadataSet(farmId, cid);
    }

    function uri(uint256 id) public view override returns (string memory) {
        string memory cid = _farmCid[id];
        require(bytes(cid).length > 0, "FarmShares: metadata not set");
        return string(abi.encodePacked("ipfs://", cid));
    }

    function getFarmMetadata(uint256 id) external view returns (string memory) {
        return _farmCid[id];
    }
}
