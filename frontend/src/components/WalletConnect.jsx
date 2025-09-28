import { useDAppConnector } from "../context/WalletContext";

export default function WalletConnect() {
  const { dAppConnector, userAccountId, disconnect, refresh } = useDAppConnector() ?? {};

  const handleLogin = async () => {
    if (dAppConnector) {
      await dAppConnector.openModal();
      if (refresh) refresh();
    }
  };

  const handleDisconnect = () => {
    if (disconnect) {
      void disconnect();
    }
  };

  if (!userAccountId) {
    return (
      <button disabled={!dAppConnector} onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-all cursor-pointer"
        >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="px-3 py-1 bg-white/10 text-white rounded-full text-sm border border-white/30">
        {`${userAccountId.slice(0, 4)}...${userAccountId.slice(-3)}`}
      </div>
      <button onClick={handleDisconnect} disabled={!dAppConnector}
        className="px-4 py-2 hover:scale-105 bg-red-400 text-white dark:hover:bg-error/20   hover:text-error font-medium rounded-full transition-all duration-300 text-sm">
        Disconnect
      </button>
    </div>
  );
}