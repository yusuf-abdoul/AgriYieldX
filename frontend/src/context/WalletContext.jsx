import { useEffect, useState, createContext, useContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  HederaSessionEvent,
  HederaJsonRpcMethod,
  DAppConnector,
  HederaChainId,
} from '@hashgraph/hedera-wallet-connect';
import { LedgerId } from '@hashgraph/sdk';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const queryClient = new QueryClient();

const metadata = {
  name: 'AgriYieldX',
  description: 'Decentralized Agricultural Market Place',
  url: 'ur app image url',
  icons: ['link to ur icon'],
};


const DAppConnectorContext = createContext(null);
export const useDAppConnector = () => useContext(DAppConnectorContext);


export function ClientProviders({ children }) {
  const [dAppConnector, setDAppConnector] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [userAccountId, setUserAccountId] = useState(null);
  const [sessionTopic, setSessionTopic] = useState(null);

  useEffect(() => {
    if (!dAppConnector) return;


    const connectorWithEvents = dAppConnector;
    const subscription = connectorWithEvents.events$?.subscribe((event) => {
      if (event.name === 'accountsChanged' || event.name === 'chainChanged') {
        setUserAccountId(dAppConnector.signers?.[0]?.getAccountId().toString() ?? null);

        if (event.data && event.data.topic) {
          setSessionTopic(event.data.topic);
        } else if (dAppConnector.signers?.[0]?.topic) {
          setSessionTopic(dAppConnector.signers[0].topic);
        } else {
          setSessionTopic(null);
        }
      } else if (event.name === 'session_delete' || event.name === 'sessionDelete') {
        setUserAccountId(null);
        setSessionTopic(null);
      }
    });

    setUserAccountId(dAppConnector.signers?.[0]?.getAccountId().toString() ?? null);
    if (dAppConnector.signers?.[0]?.topic) setSessionTopic(dAppConnector.signers[0].topic);
    return () => subscription && subscription.unsubscribe();
  }, [dAppConnector]);

  const disconnect = async () => {
    if (dAppConnector && sessionTopic) {
      await dAppConnector.disconnect(sessionTopic);
      setUserAccountId(null);
      setSessionTopic(null);
    }
  };

  const refresh = () => {
    if (dAppConnector) {
      setUserAccountId(dAppConnector.signers?.[0]?.getAccountId().toString() ?? null);
      setSessionTopic(dAppConnector.signers?.[0]?.topic ?? null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function init() {
      const connector = new DAppConnector(
        metadata,
        LedgerId.TESTNET,
        projectId,
        Object.values(HederaJsonRpcMethod),
        [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
        [HederaChainId.Mainnet, HederaChainId.Testnet],
      );
      await connector.init();
      if (isMounted) {
        setDAppConnector(connector);
        setIsReady(true);
      }
    }
    init().catch(console.log);
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady)
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
        Loading wallet...
      </div>
    );

  return (
    <DAppConnectorContext.Provider value={{ dAppConnector, userAccountId, sessionTopic, disconnect, refresh }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </DAppConnectorContext.Provider>
  );
}
