import { Message } from "@/types/main";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const backendUrl = "http://localhost:8000";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getResources = async () => {
  const resources = await fetch(`${backendUrl}/resource`);
  return await resources.json();
}

export const getResourceContents = async (name: string | undefined) => {
  if (name != undefined) {
    const resourceContents = await fetch(`${backendUrl}/resource/${name}`);
    return await resourceContents.json();
  }
  return { name: name, contents: "" };
}


export const getNotes = async (name: string | undefined) => {
  if (name != undefined) {
    const notes = await fetch(`${backendUrl}/notes/${name}`);
    return await notes.json();
  }
  return { name: name, contents: "" };
}


export const downloadResource = async (url: string) => {
  const response = await fetch(
    `${backendUrl}/resource`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url }),
    }
  );
  return await response.json();
}

export const chat = async (messages: Message[], name: string | null) => {
  const response = await fetch(
    `${backendUrl}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: messages, name: name }),
    }
  );
  if (!response.body) throw new Error("No response body");

  return response.body;
}