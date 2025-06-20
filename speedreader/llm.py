from typing import Any
from dotenv import load_dotenv
import json
from openai import OpenAI
from tqdm import tqdm

import models
import utils

load_dotenv()
client = OpenAI()

with open("prompts/generate_outline.md") as f:
    generate_outline_system_prompt = f.read()

with open("prompts/shorten_outline.md") as f:
    shorten_outline_system_prompt = f.read()

with open("prompts/textual_alignment.md") as f:
    textual_alignment_system_prompt = f.read()


async def test_chat(messages: list[dict[str, str]]):
    return await client.chat.completions.create(
        model="gemini/gemini-2.0-flash",
        messages=messages,
        stream=True,
    )


def generate_outline(name: str):
    with open(f"resources/{name}/content.md") as f:
        contents = f.read()
    chunks = utils.create_chunks(contents)
    outline = ""
    for chunk in tqdm(chunks):
        response = client.beta.chat.completions.parse(
            model="gemini/gemini-2.0-flash",
            messages=[
                {
                    "role": "system",
                    "content": generate_outline_system_prompt,
                },
                {
                    "role": "user",
                    "content": f"OUTLINE SO FAR:\n```\n{outline}\n```\nCURRENT CHUNK:\n```\n{chunk}\n```",
                },
            ],
            response_format=models.OutlineResponse
        )
        outline = response.choices[0].message.parsed.outline
    return outline, chunks


def shorten_outline(name: str, outline: str):
    outline_lines = len(outline.split("\n"))
    if outline_lines > 70:
        response = client.beta.chat.completions.parse(
            model="gemini/gemini-2.0-flash",
            messages=[
                {
                    "role": "system",
                    "content": shorten_outline_system_prompt,
                },
                {
                    "role": "user",
                    "content": (
                        f"OUTLINE:\n```\n{outline}\n```\n"
                        f"NUMBER OF LINES CURRENTLY: {outline_lines}\n"
                        "TARGET NUMBER OF LINES: 70"
                    )
                },
            ],
            response_format=models.OutlineResponse
        )
        outline = response.choices[0].message.parsed.outline
    outline_tree = utils.convert_outline_to_json(outline)[0]
    with open(f"resources/{name}/outline.json", "w", encoding="utf-8") as f:
        json.dump(outline_tree, f, indent=4)
    return outline, outline_tree


def textual_alignment(name: str, outline: str, outline_tree: dict[str, Any], chunks: list[str]):
    all_paths = [path[1:] for path in utils.flatten_tree(outline_tree)]
    path_quotes = dict()
    for path in tqdm(all_paths):
        quotes = []
        summary = ""
        for chunk in chunks:
            response = client.beta.chat.completions.parse(
                model="gemini/gemini-2.0-flash",
                messages=[
                    {
                        "role": "system",
                        "content": textual_alignment_system_prompt,
                    },
                    {
                        "role": "user",
                        "content": f"OUTLINE:\n```\n{outline}\n```\nCURRENT CHUNK:\n```\n{chunk}\n```",
                    },
                ],
                response_format=models.QuoteResponse
            )
            parsed_response = response.choices[0].message.parsed
            quotes += parsed_response.quotes
            summary = parsed_response.summary
        path_quotes[path] = {
            "quotes": quotes,
            "summary": summary
        }
        with open(f"resources/{name}/quotes.json", "w", encoding="utf-8") as f:
            json.dump(path_quotes, f, indent=4)
