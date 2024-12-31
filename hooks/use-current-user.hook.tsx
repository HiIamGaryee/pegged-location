'use client';

import { useEffect, useState } from 'react';
import * as fcl from '@onflow/fcl';

export default function useCurrentUser() {
	const [Flowuser, setUser] = useState({ addr: null });
	const [loggedIn, setLoggedIn] = useState(false);

	const FlowlogIn = async () => {
        const user = await fcl.authenticate();
        setUser (user);
        setLoggedIn(true);
    };

    const FlowlogOut = async () => {
        await fcl.unauthenticate();
        setUser ({ addr: null });
        setLoggedIn(false);
    };

	useEffect(() => {
		fcl.currentUser().subscribe(setUser);
	}, []);

	return [Flowuser, loggedIn, FlowlogIn, FlowlogOut];
}
