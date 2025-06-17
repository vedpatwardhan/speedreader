"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // Or any theme you like
import { ResourceContentType } from "@/types/main";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";


const Resource = ({ name, resourceContents }: {
    name: string | undefined,
    resourceContents: ResourceContentType
}) => {
    const [substring,] = useQueryState("substring");
    const [contents, setContents] = useState(resourceContents.contents);
    const ref = useRef<HTMLDivElement>(null);

    const locateSubstring = () => {
        let currentSubstring = substring;
        if (currentSubstring && currentSubstring.length) {
            if (currentSubstring.includes("**")) currentSubstring = currentSubstring.replaceAll("**", "\*\*");
            if (currentSubstring.startsWith("#")) {
                const currentSubstringParts = currentSubstring.split(" ");
                setContents(
                    contents.replace(
                        currentSubstring,
                        `${currentSubstringParts[0]} 🎯 **${currentSubstringParts.slice(1).join(" ")}** 🎯`
                    )
                );
            }
            else if (contents != undefined) {
                setContents(
                    contents.replace(currentSubstring, `🎯🎯 **${currentSubstring}** 🎯🎯`)
                );
            }
        }
    }

    useEffect(() => {
        const textContent = ref.current?.textContent || "";
        const substringIndex = textContent.indexOf(substring || "") * 0.85;
        locateSubstring();

        ref.current?.scrollTo({
            top: (substringIndex / textContent.length) * (ref.current?.scrollHeight || 0),
            behavior: "smooth",
        });
    }, [substring]);

    useEffect(
        () => {
            setContents(resourceContents.contents);
            locateSubstring();
        },
        [resourceContents.contents, name]
    );

    return (
        <div ref={ref} className="w-full border-2 rounded-lg h-[85vh] overflow-auto">
            <article className="prose prose-invert max-w-none px-6 py-12 mx-auto">
                <ReactMarkdown
                    children={contents}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                />
            </article>
        </div>
    );
};

export default Resource;
