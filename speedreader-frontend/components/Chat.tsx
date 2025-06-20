"use client";

import { useEffect, useState } from "react";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import { Message } from "@/types/main";

const Chat = ({ name }: { name: string | undefined }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => setMessages([]), [name]);

    return <div className="w-1/2 mb-auto pb-4 rounded-lg border-2 flex flex-col gap-2 h-full justify-between">
        <h2 className="text-lg font-bold mt-1 py-2 px-4 border-b-2">Chat</h2>
        <ChatHistory messages={messages} />
        <ChatInput messages={messages} setMessages={setMessages} />
    </div>
}

export default Chat;
