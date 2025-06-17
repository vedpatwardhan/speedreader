// pages/api/chat/route.js (App Router)
const backendUrl = "http://localhost:8000";

export async function POST(req: Request) {
  const { messages } = await req.json()
  const res = await fetch(`${backendUrl}/chat`, {
    method: "POST",
    body: JSON.stringify({ messages }),
    headers: {
      "Content-Type": "application/json",
    }
  })
  return res
}
