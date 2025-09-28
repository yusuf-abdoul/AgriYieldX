import { createContext, useContext, useState, useEffect } from 'react';
import { HashConnect } from 'hashconnect';

const WalletContext = createContext({
    connected: false,
    accountId: null,
    evmAddress: null,
    hashconnect: null,
    connect: () => { },
    disconnect: () => { }
});

export const WalletProvider = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const [accountId, setAccountId] = useState(null);
    const [evmAddress, setEvmAddress] = useState(null);
    const [hashconnect, setHashconnect] = useState(null);

    useEffect(() => {
        const initHashConnect = async () => {
            const origin = typeof window !== 'undefined' && window.location ? window.location.origin : '';
            const appMetadata = {
                name: "AgriYield DApp",
                description: "Crowdfunding & Marketplace for farmers",
                icon: origin ? `${origin}/favicon.ico` : undefined,
                url: origin,
            };

            const hc = new HashConnect(true);
            // Initialize on testnet. Newer hashconnect versions accept two params (metadata, network).
            try {
                await hc.init(appMetadata, "testnet");
            } catch (e) {
                console.error("HashConnect init failed:", e);
                return;
            }

            hc.foundExtensionEvent.on((walletMetadata) => {
                console.log("Found wallet:", walletMetadata);
            });

            hc.pairingEvent.on((pairingData) => {
                const id = pairingData.accountIds[0];
                setAccountId(id);
                setEvmAddress(pairingData.accountIds[0]); // For simplicity, using accountId as evmAddress
                setConnected(true);
            });

            hc.connectionStatusChangeEvent.on((connectionStatus) => {
                if (!connectionStatus) {
                    setConnected(false);
                    setAccountId(null);
                    setEvmAddress(null);
                }
            });

            setHashconnect(hc);
        };

        initHashConnect();
    }, []);

    const connect = async () => {
        if (!hashconnect) return;
        try {
            // Try to open HashPack extension connect prompt
            await hashconnect.connectToLocalWallet();
        } catch (e) {
            // Fallback: create a pairing string for mobile/desktop HashPack
            try {
                const pairing = await hashconnect.connect();
                const pairingString = pairing?.pairingString || pairing?.pairingData?.pairingString;
                console.log("HashConnect pairing string:", pairingString);
                alert("Open HashPack and scan the QR from browser console (pairing string logged).\nIf the extension is installed, make sure it's enabled on this site.");
            } catch (err) {
                console.error("HashConnect connect failed:", err);
            }
        }
    };

    const disconnect = async () => {
        if (hashconnect) {
            await hashconnect.disconnect();
            setConnected(false);
            setAccountId(null);
            setEvmAddress(null);
        }
    };

    return (
        <WalletContext.Provider
            value={{
                connected,
                accountId,
                evmAddress,
                hashconnect,
                connect,
                disconnect
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export default WalletContext;

