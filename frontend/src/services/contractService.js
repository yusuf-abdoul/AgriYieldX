import { ethers } from "ethers";

// Contract ABIs (these would be generated after compilation)
const AgriYieldAbi = [
  "function createFarm(uint256 fundingGoal, uint256 shareSupply, uint256 sharePrice, string memory metaCID) external returns (uint256)",
  "function invest(uint256 farmId, uint256 amount) external",
  "function getFarm(uint256 farmId) external view returns (tuple(address farmer, uint256 fundingGoal, uint256 raised, uint256 proceeds, uint256 shareSupply, uint256 sharePrice, uint8 status, string metaCID))",
  "function disburseFunds(uint256 farmId) external",
  "function depositProceeds(uint256 farmId, uint256 amount) external",
  "function claimInvestorPayout(uint256 farmId) external"
];

const MarketplaceAbi = [
  "function listItem(uint256 farmId, uint256 price, uint256 quantity, string calldata metadataCID) external returns (uint256)",
  "function purchase(uint256 listingId, uint256 quantity) external returns (uint256)",
  "function getListing(uint256 listingId) external view returns (tuple(uint256 farmId, address farmer, uint256 price, uint256 quantity, uint256 quantityRemaining, string metadataCID, bool isActive))",
  "function shipOrder(uint256 orderId, string calldata shippingCID) external",
  "function confirmReceived(uint256 orderId, string calldata proofCID) external",
  "function releaseFunds(uint256 orderId) external"
];

const CONTRACT_ADDRESSES = {
  agriYield: import.meta.env.VITE_AGRIYIELD_ADDRESS,
  marketplace: import.meta.env.VITE_MARKETPLACE_ADDRESS,
  mockUsdt: import.meta.env.VITE_MOCK_USDT_ADDRESS
};

export async function createFarm(goal, shares, price, cid) {
  if (!window.ethereum) throw new Error("Wallet not found");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESSES.agriYield, AgriYieldAbi, signer);
  const tx = await contract.createFarm(goal, shares, price, cid);
  await tx.wait();
  return tx;
}

export async function invest(farmId, amount) {
  if (!window.ethereum) throw new Error("Wallet not found");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESSES.agriYield, AgriYieldAbi, signer);
  const tx = await contract.invest(farmId, amount);
  await tx.wait();
  return tx;
}

export async function getFarm(farmId) {
  if (!window.ethereum) throw new Error("Wallet not found");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESSES.agriYield, AgriYieldAbi, provider);
  return await contract.getFarm(farmId);
}

export async function getListings() {
  // This would need to be implemented with events or a view function
  // For now, return mock data
  return [
    {
      id: 1,
      name: "Organic Rice Farm",
      price: 10,
      unit: "kg",
      available: 500,
      image: "https://placehold.co/400x200",
    },
    {
      id: 2,
      name: "Tomato Greenhouse",
      price: 5,
      unit: "kg",
      available: 200,
      image: "https://placehold.co/400x200",
    },
  ];
}

// TEMP: Demo farms while contracts are not deployed or indexer isn't ready
export async function getFarms() {
  return [
    {
      id: 1,
      name: "Sunrise Maize Farm",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop",
      fundingGoal: 10000,
      raised: 2500,
      metaCID: "demo-maize-1",
    },
    {
      id: 2,
      name: "Green Valley Rice",
      image: "https://images.unsplash.com/photo-1500937287812-8f7f8e7a8c44?q=80&w=1200&auto=format&fit=crop",
      fundingGoal: 20000,
      raised: 12000,
      metaCID: "demo-rice-2",
    },
  ];
}

export async function purchase(listingId, qty) {
  if (!window.ethereum) throw new Error("Wallet not found");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESSES.marketplace, MarketplaceAbi, signer);
  const tx = await contract.purchase(listingId, qty);
  await tx.wait();
  return tx;
}

export const contractService = {
  createFarm,
  invest,
  getFarm,
  getFarms,
  getListings,
  purchase
};

// // contractService.js
// export const contractService = {
//   async getListings() {
//     // Fake listings for demo — replace with contract calls
//     return [
//       {
//         id: 1,
//         name: "Organic Rice Farm",
//         price: 10,
//         unit: "kg",
//         available: 500,
//         image: "https://placehold.co/400x200",
//       },
//       {
//         id: 2,
//         name: "Tomato Greenhouse",
//         price: 5,
//         unit: "kg",
//         available: 200,
//         image: "https://placehold.co/400x200",
//       },
//     ];
//   },

//   async invest(farmId, amount) {
//     console.log(`Investing ${amount} into farm ${farmId}...`);
//     // Replace with contract call
//     return { success: true };
//   },

//   async purchase(listingId, qty) {
//     console.log(`Purchasing ${qty} units from listing ${listingId}...`);
//     // Replace with contract call
//     return { success: true };
//   },
// };
