"use client"
import { useEffect, } from "react";

export default function redirectPage() {
    const requestAccessToken = async () => {
        const code: string | null = new URL(location.href).searchParams.get("code")!;
        const body = {
            grant_type: "authorization_code",
            code: code,
            client_id: "923083694343-lef2m19k0bcn38p4p07pkh6tq32oe1so.apps.googleusercontent.com",
            client_secret: "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",
            redirect_uri: "http://localhost:3000/calendar/authorization",
        };
        const options = {
            method: "POST",
            body: JSON.stringify(body),
        };

        const response = await fetch("https://oauth2.googleapis.com/token", options);
        const jsonData = await response.json();
        const accessToken: string = jsonData.access_token;
        const refreshToken: string = jsonData.refresh_token;
        localStorage.clear();
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        window.opener.postMessage(accessToken, "*");
        window.close();
    };

    useEffect(() => {
        requestAccessToken();
    }, []);
}