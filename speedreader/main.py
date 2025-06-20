# main.py
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json
from openai.types.responses import (
    ResponseTextDeltaEvent,
    ResponseFunctionCallArgumentsDeltaEvent
)
import uvicorn
import agent
import llm
import utils

app = FastAPI(title="Resource API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/resource")
def list_resources():
    try:
        return utils.list_resources()
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/resource/{name}")
def get_resource_contents(name: str):
    try:
        return {
            "name": name,
            "contents": utils.get_resource_contents(name)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/notes/{name}")
def get_notes(name: str):
    try:
        return {
            "name": name,
            "contents": utils.get_notes(name)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/resource")
async def download_resource(request: Request):
    try:
        data = await request.json()
        url = data.get("url")
        print("Downloading resource", url)
        name = utils.download_resource(url)
        print("Generating outline")
        outline, chunks = llm.generate_outline(name)
        print("Shortening outline")
        outline, outline_tree = llm.shorten_outline(name, outline)
        print("Textual alignment")
        with open("latest_outline.md", "w") as f:
            f.write(outline)
        llm.textual_alignment(name, outline, outline_tree, chunks)
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        messages = data.get("messages")
        name = data.get("name")
        response = agent.run(messages, name)

        async def stream(response):
            async for event in response.stream_events():
                to_yield = True
                if event.type == "raw_response_event":
                    if isinstance(event.data, ResponseFunctionCallArgumentsDeltaEvent):
                        chunk = {"type": "function_call_arguments", "delta": event.data.delta}
                    elif isinstance(event.data, ResponseTextDeltaEvent):
                        chunk = {"type": "response_text", "delta": event.data.delta}
                    else:
                        to_yield = False
                elif event.type == "agent_updated_stream_event":
                    chunk = {"type": "agent_updated", "new_agent": event.new_agent.name}
                elif event.type == "run_item_stream_event":
                    if event.name == "tool_called":
                        print(event.name, event.item.raw_item.call_id, event.item.raw_item.name)
                        chunk = {
                            "type": "tool_called",
                            "call_id": event.item.raw_item.call_id,
                            "name": event.item.raw_item.name,
                            "arguments": event.item.raw_item.arguments
                        }
                    elif event.name == "tool_output":
                        print(event.name, event.item.raw_item["call_id"])
                        chunk = {
                            "type": "tool_output",
                            "call_id": event.item.raw_item["call_id"],
                            "output": event.item.raw_item["output"]
                        }
                    else:
                        to_yield = False
                else:
                    to_yield = False
                if to_yield:
                    print(chunk)
                    yield f"data: {json.dumps(chunk)}\n\n"
            chunk = {"type": "end_stream", "delta": ""}
            yield f"data: {json.dumps(chunk)}\n\n"

        return StreamingResponse(stream(response), media_type="text/event-stream")
    except Exception as e:
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
