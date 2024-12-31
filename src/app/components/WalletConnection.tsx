'use client';
import React from 'react';
import useCurrentUser from '@hooks/use-current-user.hook';
import { useAuth } from '../context/AuthContext';

export default function WalletConnection() {
  const {
    OKXconnected,
    OKXwalletAddress,
    OKXchainId,
    OKXlogIn,
    OKXlogOut,
  } = useAuth();

  const [ Flowuser, FlowloggedIn, FlowlogIn, FlowlogOut ] = useCurrentUser ();

  return (
    <div className="page-container">
      {/* OKX Wallet Section */}
      <div className="card">
        <h1 className="card-title">OKX Wallet Connect</h1>

        {OKXconnected ? (
          <div>
            <p className="card-subtitle">Thanks for connecting your wallet!</p>
            <div className="space-y-4">
              <p className="connected-text">
                Wallet Address:{' '}
                {OKXwalletAddress && (
                  <span className="connected-username">{OKXwalletAddress}</span>
                )}
              </p>
              {OKXchainId && (
                <p className="connected-text">
                  Chain ID:{' '}
                  <span className="connected-username">{OKXchainId}</span>
                </p>
              )}
              <button onClick={OKXlogOut} className="button button-disconnect">
                Disconnect Wallet
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="card-subtitle">Connect your wallet with OKX</p>
            <button onClick={OKXlogIn} className="button button-connect">
              Connect OKX Wallet
            </button>
          </div>
        )}
      </div>

      {/* Flow Cadence Wallet Section */}
      {/* <div className="card">
        <h1 className="card-title">Flow Wallet Connect</h1>
        <p className="card-subtitle">Connect your wallet to get started</p>

        {FlowloggedIn ? (
        <div className="space-y-4">
          <p className="connected-text">
            Connected as:{' '}
            {Flowuser && typeof Flowuser === 'object' && Flowuser.addr ? (
                <span className="connected-username">{Flowuser.addr}</span>
            ) : (
                "Not connected"
            )}
          </p>
            <button onClick={FlowlogOut} className="button button-disconnect">
              Disconnect Wallet
          </button>
        </div>
        ) : (
          <button onClick={FlowlogIn} className="button button-connect">
            Connect Flow Wallet
          </button>
        )}
      </div> */}

<div>
                <h1>Flow Wallet Connect</h1>
                {FlowloggedIn ? (
                    <div>
                        <p>Connected as: {Flowuser.addr}</p>
                        <button onClick={FlowlogOut}>Disconnect Wallet</button>
                    </div>
                ) : (
                    <button onClick={FlowlogIn}>Connect Flow Wallet</button>
                )}
            </div>
            
    </div>
  );
}
