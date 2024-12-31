// app/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { validate3rd } from '@telegram-apps/init-data-node/web';
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui'; //okx wallet sdk
import useCurrentUser from '@hooks/use-current-user.hook'; 
import * as fcl from "@onflow/fcl";


type AuthContextType = {
  //telegram user data
  userID: number | null;
  username: string | null;
  windowHeight: number;
  isDataValid: boolean;
  //loggedIn: boolean; // From useCurrentUser hook
  //logIn: () => void; // From useCurrentUser hook
  //logOut: () => void; // From useCurrentUser hook

  //okx wallet
  OKXconnected: boolean;
  OKXwalletAddress: string | null;
  OKXchainId: string | null;
  OKXlogIn: () => Promise<void>;
  OKXlogOut: () => Promise<void>;

  //flow cadence wallet state
  Flowuser: any;
  FlowloggedIn: boolean;
  FlowlogIn: () => Promise<void>;
  FlowlogOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Telegram-related state
  const [windowHeight, setWindowHeight] = useState<number>(0);
  const [userID, setUserID] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isDataValid, setIsDataValid] = useState<boolean>(false);

  // OKX wallet-related state
  const [client, setClient] = useState<OKXUniversalConnectUI | null>(null);
  const [OKXwalletAddress, setOKXWalletAddress] = useState<string | null>(null);
  const [OKXchainId, setOKXChainId] = useState<string | null>(null);
  const [OKXconnected, setOKXConnected] = useState(false);

  //flow cadence wallet-related state
  const [Flowuser, setFlowUser] = useState<any>(null);
  const [FlowloggedIn, setFlowLoggedIn] = useState<boolean>(false);

  // Using the useCurrentUser hook for Telegram user data
  //const [user, loggedIn, logIn, logOut] = useCurrentUser();

  // Convert loggedIn to a boolean
  //const isLoggedIn = loggedIn && loggedIn !== null;

  // UseEffect for initializing OKX and Flow Cadence wallets
  useEffect(() => {
    // Ensure this code only runs on the client side
    if (typeof window !== "undefined" && WebApp) {
      WebApp.isVerticalSwipesEnabled = false;
      setWindowHeight(WebApp.viewportStableHeight || window.innerHeight);
      WebApp.ready();


      // Validate Telegram data
			(async () => {
				try {
					const botId = 7842983644; // Replace with your actual bot ID
					await validate3rd(WebApp.initData, botId); // Validate initData
					setIsDataValid(true);
					const user = WebApp.initDataUnsafe.user; // Extract user data if valid
					setUserID(user?.id || null);
					setUsername(user?.username || null);
				} catch (error) {
					console.error('Validation failed:', error);
					setIsDataValid(false);
				}
			})();

      // Initialize OKX Wallet Client
      const initClient = async () => {
        try {
          const uiClient = await OKXUniversalConnectUI.init({
            dappMetaData: {
              name: 'Pegged Location',
              icon: '/logo.png',
            },
            actionsConfiguration: {
              returnStrategy: 'none', // Or 'tg://resolve'
              modals: 'all',
            },
            uiPreferences: {
              theme: THEME.LIGHT,
            },
          });
          setClient(uiClient);
        } catch (error) {
          console.error('Failed to initialize OKX UI:', error);
        }
      };
      initClient();

    }
  }, []);

  //okx login
 const OKXlogIn = async () => {
    console.log('Client:', client);
    if (!client){
      console.error('Client not initialized');
      return;
    }try {
      const session = await client.openModal({
        namespaces: {
          eip155: {
            chains: ['eip155:747'],
            defaultChain: '747',
          },
        },
      });

      if (!session || !session.namespaces.eip155) {
        console.error('Session is undefined or invalid');
        return;
      }

      const address = session.namespaces.eip155.accounts[0]?.split(':')[2];
      const rawChainId = session.namespaces.eip155.chains[0];
      const chain = rawChainId?.split(':')[1] || null;

      setOKXWalletAddress(address);
      setOKXChainId(chain);
      setOKXConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  //okx logout
  const OKXlogOut = async () => {
    if (!client) return;
    try {
      await client.disconnect();
      setOKXWalletAddress(null);
      setOKXChainId(null);
      setOKXConnected(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // Flow cadence login (stub, add actual Flow logic if needed)
  // const FlowlogIn = async () => {
  //   // Example Flow login logic (replace with actual Flow wallet logic)
  //   setFlowUser({ username: "FlowUser" });
  //   setFlowLoggedIn(true);
  // };
  const FlowlogIn = async () => {
    try {
      const user = await fcl.authenticate();
      setFlowUser (user);
      setFlowLoggedIn(true);
    } catch (error) {
      console.error("Flow login failed:", error);
    }
  };

  // Flow cadence logout (stub, add actual Flow logic if needed)
  // const FlowlogOut = async () => {
  //   setFlowUser(null);
  //   setFlowLoggedIn(false);
  // };
  const FlowlogOut = async () => {
    try {
      await fcl.unauthenticate();
      setFlowUser (null);
      setFlowLoggedIn(false);
    } catch (error) {
      console.error("Flow logout failed:", error);
    }
  };

  const contextValue = {
    userID,
    username,
    windowHeight,
    isDataValid,

    //okx wallet
    OKXconnected,
    OKXwalletAddress,
    OKXchainId,
    OKXlogIn,
    OKXlogOut,

    //flow cadence wallet
    Flowuser,
    FlowloggedIn,
    FlowlogIn,
    FlowlogOut,
  };


  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
