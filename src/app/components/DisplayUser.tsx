"use client";

import Link from "next/link";
import React from 'react';
import { useAuth } from "../context/AuthContext";
import useCurrentUser from "@hooks/use-current-user.hook";

export default function DisplayUser() {
  const {OKXlogIn, userID, username, windowHeight } = useAuth();
  //const [Flowuser, FlowloggedIn, FlowlogIn, FlowlogOut] = useCurrentUser ();
  const [FlowlogIn] =useCurrentUser();
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen text-center space-y-4">
      <h1 className="text-4xl font-bold  text-primary">
        Welcome to the Pegged Location Telegram App!
      </h1>
      <p>Connect Your Wallet now!</p>
      {/* <p>User ID: {userID || "Not available"}</p>
      <p>Username: {username || "Not available"}</p>
      <p>Window Height: {windowHeight}</p> */}

      {/* <Link href="/info"> */}
      <div className="mt-4 py-2 px-4 border-2 border-primary bg-primary text-white rounded-full hover:bg-primaryDark transition duration-150 ease-in-out">
        <button onClick={OKXlogIn}>OKX Wallet</button>
      </div>
      <div className="mt-4 py-2 px-4 border-2 border-primary bg-primary text-white rounded-full hover:bg-primaryDark transition duration-150 ease-in-out">
        <button onClick={FlowlogIn}>Flow Cadence Wallet</button>
      </div>
      
      {/* </Link> */}
      {/* <Link href="/function">
          <div className="mt-4 py-2 px-4 border-2 border-primary text-primary rounded-full hover:bg-gray-200 transition duration-150 ease-in-out">
            Use Now
          </div>
        </Link> */}
    </div>
  );
}
