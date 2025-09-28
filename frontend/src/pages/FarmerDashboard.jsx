import { useState } from "react";
import { uploadToIPFS } from "../services/ipfsService";
import { createFarm } from "../services/contractService";
import Sidebar from "../components/Sidebar";

export default function FarmerDashboard() {
  const [file, setFile] = useState(null);
  const [goal, setGoal] = useState("");
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async () => {
    try {
      const cid = await uploadToIPFS(file);
      await createFarm(goal, shares, price, cid);
      alert("Farm created successfully (or demo mode if contracts not deployed)");
    } catch (e) {
      console.error(e);
      alert("Failed to create farm. See console for details.")
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6 min-h-screen">
      <Sidebar userType="farmer" />
      <div>
        <div className="rounded-2xl shadow-md bg-white dark:bg-gray-800 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Create Farm</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farm Image</label>
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Funding Goal (HBAR)</label>
              <input
                placeholder="e.g., 10000"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Share Supply</label>
                <input
                  placeholder="e.g., 1000"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Share Price (HBAR)</label>
                <input
                  placeholder="e.g., 10"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-all"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
