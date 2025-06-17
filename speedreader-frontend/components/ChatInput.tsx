"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "./ui/input"
import { chat } from "@/lib/utils";
import { Message } from "@/types/main";
import { ArrowBigRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const ChatInput = ({ messages, setMessages }: {
    messages: Message[],
    setMessages: Dispatch<SetStateAction<Message[]>>
}) => {
    const [refresh, setRefresh] = useQueryState("refresh", { shallow: false });
    const [message, setMessage] = useState("");
    const [event, setEvent] = useState("");
    const [substring, setSubstring] = useQueryState("substring");
    const [name,] = useQueryState("name", { shallow: false });

    const readChunks = async (
        reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>,
        decoder: TextDecoder,
        newMessages: Message[]
    ) => {
        let buffer = "";
        let quote_call_id = undefined;
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split("\n\n");
            buffer = events.pop() || ""; // Save the incomplete event for next chunk
            const lastMessage = newMessages.at(-1) as Message;
            for (const event of events) {
                if (event.startsWith("data: ")) {
                    const chunk = JSON.parse(event.slice(6).trim());
                    if (chunk.type == "response_text") {
                        lastMessage.content += chunk.delta || "";
                        setMessages([...newMessages]);
                    }
                    else {
                        if (chunk.type == "tool_called" && chunk.name == "locate_quote")
                            quote_call_id = chunk.call_id;
                        if (chunk.type == "tool_called" && chunk.name == "make_note")
                            setRefresh(refresh == null ? "true" : null);
                        else if (chunk.type == "tool_output" && chunk.call_id == quote_call_id)
                            setSubstring(chunk.output);
                        setEvent(JSON.stringify(chunk));
                    }
                }
            }
        }
        window.setTimeout(() => setEvent(""), 5000);
    }

    return <div className="flex flex-col gap-2 mx-4">
        {event.length > 0 && <Tooltip>
            <TooltipTrigger>
                <div className="flex gap-2 items-center text-primary-foreground font-semibold ml-2">
                    <span>last event</span><ArrowBigRight /><span>{event.slice(0, 75) + "..."}</span>
                </div>
            </TooltipTrigger>
            <TooltipContent className="text-white">
                {event}
            </TooltipContent>
        </Tooltip>}
        <div className="w-full flex justify-center">
            <Input
                id="msg"
                name="msg"
                placeholder="Type a message..."
                className="border-2 rounded-lg w-full py-4 h-full"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        const newMessages = [
                            ...messages,
                            { role: "user", content: message },
                            { role: "assistant", content: "" }
                        ];
                        setMessages(newMessages);
                        setMessage("");
                        setEvent("");
                        chat(newMessages, name).then(
                            (responseBody: ReadableStream<Uint8Array<ArrayBufferLike>>) => {
                                const reader = responseBody.getReader();
                                const decoder = new TextDecoder("utf-8");
                                readChunks(reader, decoder, newMessages);
                            }
                        )
                        setMessage("");
                    }
                }}
            />
        </div>
    </div>
}

export default ChatInput;
