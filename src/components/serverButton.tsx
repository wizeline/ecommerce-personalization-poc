import type React from "react";
import { useState } from "react";
const fromTheServer: () => string = () => `Random number from the server ${Math.random()}`;


export const ServerButton: React.FC = () => {
    const [message, setMessage] = useState("initial message");

    return <button onClick={() => setMessage(fromTheServer())}>{message}</button>;
}