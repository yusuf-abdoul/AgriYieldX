import { useEffect, useState, useContext } from "react";
import WalletContext from "../context/WalletContext";
import ListCard from "../components/ListCard";
import { contractService } from "../services/contractService";
import Sidebar from "../components/Sidebar";

export default function BuyerDashboard() {
  const { connected } = useContext(WalletContext);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (connected) {
      contractService.getListings().then(setListings);
    }
  }, [connected]);

  const handlePurchase = async (listingId, quantity) => {
    try {
      if (!connected) {
        alert("Please connect your wallet before purchasing.");
        return;
      }
      await contractService.purchase(listingId, quantity);
      alert("Purchase successful!");
    } catch (err) {
      console.error(err);
      alert("Purchase failed.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6 min-h-screen">
      <Sidebar userType="buyer" />
      <div>
        <div className="rounded-2xl shadow-md bg-white dark:bg-gray-800 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Buyer Dashboard</h1>
          {!connected ? (
            <p className="text-sm text-gray-700 dark:text-gray-400">Please connect your wallet to browse marketplace listings.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListCard
                  key={listing.id}
                  listing={listing}
                  onBuy={(l) => handlePurchase(l.id, 1)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
