"use client";

import { useEffect, useState } from "react";

export default function page() {
    const openNewWindowAsync = () => {
        const queryParams = new URLSearchParams({
            response_type: "code",
            client_id: "923083694343-lef2m19k0bcn38p4p07pkh6tq32oe1so.apps.googleusercontent.com",
            redirect_uri: "http://localhost:3000/calendar/authorization",
            scope: "https://www.googleapis.com/auth/calendar",
            access_type: "offline",
        });
        window.open(`https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`, "google", "width=300,height=300");
    }

    const [hasToken, setHasToken] = useState(false);
    const onClick = () => {
        openNewWindowAsync();
    };

    useEffect(() => {
        window.addEventListener("message", (event) => {
            console.log(event.data);
            setHasToken(true);
        }, false);
    }, [])

    return (
        <button onClick={onClick} disabled={hasToken}>オープン</button>
    );
}