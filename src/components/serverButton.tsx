import type React from "react";
import { useState } from "react";
import fromTheServer  from "../../netlify/functions/from-the-server.mts";


const fetchFromTheServer: () => Promise<string> = () => fetch("./.netlify/functions/from-the-server").then(r => r.text());

export const ServerButton: React.FC = () => {
    const [message, setMessage] = useState("initial message");

    return <>
        <button onClick={() => fetchFromTheServer().then(setMessage)}>Call the server</button>
        <p>{message}</p>
    </>;
}