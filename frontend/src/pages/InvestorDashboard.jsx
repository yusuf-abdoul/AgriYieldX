import { useEffect, useState, useContext } from "react";
import WalletContext from "../context/WalletContext";
import FarmCard from "../components/FarmCard";
import { contractService } from "../services/contractService";
import Sidebar from "../components/Sidebar";

export default function InvestorDashboard() {
  const { evmAddress, connected } = useContext(WalletContext);
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    if (connected) {
      contractService.getFarms().then(setFarms);
    }
  }, [connected]);

  const handleInvest = async (farmId, amount) => {
    try {
      if (!connected) {
        alert("Please connect your wallet before investing.");
        return;
      }
      await contractService.invest(farmId, amount);
      alert("Investment successful!");
    } catch (err) {
      console.error(err);
      alert("Investment failed.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6 min-h-screen">
      <Sidebar userType="investor" />
      <div>
        <div className="rounded-2xl shadow-md bg-white dark:bg-gray-800 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Investor Dashboard</h1>
          {!connected ? (
            <p className="text-sm text-gray-700 dark:text-gray-400">Please connect your wallet to view available farms.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {farms.map((farm) => (
                <FarmCard
                  key={farm.id}
                  farm={farm}
                  onInvest={(f) => handleInvest(f.id, 1)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
