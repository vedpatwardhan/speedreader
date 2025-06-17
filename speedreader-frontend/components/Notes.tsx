"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // Or any theme you like
import { NotesType } from "@/types/main";


const Notes = ({ notes }: { notes: NotesType }) => {
    return (
        <div className="w-full border-2 rounded-lg h-[85vh] overflow-auto">
            <article className="prose prose-invert max-w-none px-6 py-12 mx-auto">
                <ReactMarkdown
                    children={notes.contents}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                />
            </article>
        </div>
    );
}

export default Notes;
