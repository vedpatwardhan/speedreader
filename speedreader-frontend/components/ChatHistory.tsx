"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // Or any theme you like
import { Message } from "@/types/main"
import { Loader } from "lucide-react";

const ChatHistory = ({ messages }: { messages: Message[] }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.scrollTo({
            top: ref.current?.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    return <div className="h-[70vh] overflow-auto border-b-2" ref={ref}>
        {messages.map((message, index) => (
            <div key={index} className={
                "border-2 rounded-lg p-2 px-4 my-3 " +
                (message.role == "user" ? "ml-auto mr-4" : "mr-auto ml-4") +
                " hover:bg-muted transition-all max-w-2xl"
            }>
                <div className="font-semibold text-primary-foreground">
                    {message.role == "user" ? "User" : "Assistant"}
                </div>
                <div className="mt-3 w-full text-inherit whitespace-pre-wrap marked min-h-8 max-h-64 overflow-auto">
                    {
                        message.content.length > 0
                            ? <article className="prose prose-invert max-w-none mx-auto prose-p:my-0 prose-ul:my-0 prose-li:my-0">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                                    {message.content}
                                </ReactMarkdown> 
                            </article>
                            : <Loader className="animate-spin" />
                    }
                    {/* {message.content.length > 0 ? message.content : <Loader className="animate-spin" />} */}
                </div>
            </div>
        ))}
    </div>
}

export default ChatHistory;
