import { useContext } from "react";
import WalletContext from "../context/WalletContext";

export default function WalletConnect() {
  const { connected, accountId, connect, disconnect } = useContext(WalletContext);

  return (
    <button
      onClick={connected ? disconnect : connect}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-all"
    >
      {connected ? `Connected: ${accountId?.slice(0, 6)}...${accountId?.slice(-4)}` : "Connect Wallet"}
    </button>
  );
}
