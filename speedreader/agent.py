import json
import os
from typing import Any
from agents import (
    Agent,
    ModelSettings,
    Runner,
    function_tool,
    set_default_openai_api,
    set_default_openai_key
)
from dotenv import load_dotenv
from utils import flatten_tree


load_dotenv()
set_default_openai_api("chat_completions")
set_default_openai_key("abc")


with open("prompts/retrieve_agent.md") as f:
    retrieve_agent_system_prompt = f.read()


# Tools

@function_tool
def get_outline(name: str) -> dict[str, Any]:
    """
    Returns the outline of the document.

    The outline is a recursive tree, and each node has a header and a list of subsections formatted as,
    ```
    [Header] > [Subsection 1] > [Subsection 2] > ... > [Subsection n]
    ```

    Args
    ----
    name: str
        The name of the document
    """
    with open(f"resources/{name}/outline.json") as f:
        return json.load(f)


@function_tool
def get_subsection_paths(name: str) -> list[str]:
    """
    This is a tool mainly meant to get exact names of subsections to be used for retrieval.
    
    Args
    ----
    name: str
        The name of the document
    """
    with open(f"resources/{name}/outline.json") as f:
        outline = json.load(f)
    return [path[1:] for path in flatten_tree(outline)]


@function_tool
def get_contents(name: str, path: str) -> list[str]:
    """
    Returns the contents of the document w.r.t. each path in the outline.

    Args
    ----
    name: str
        The name of the document
    path: str
        The path to the document
    """
    with open(f"resources/{name}/quotes.json") as f:
        quotes = json.load(f)
    return quotes[path]


@function_tool
def locate_quote(quote: str, contents: str) -> int:
    """
    Returns the quote that can be found in the contents (character for character)

    Args
    ----
    quote: str
        The quote to find
    contents: str
        The contents of the document
    """
    if len(contents) < len(quote):
        return ""
    if quote in contents:
        return quote
    contents = contents.replace("\\", "")
    if quote in contents:
        return quote
    length = len(contents)
    contents1, contents2, contents3 = contents[:length // 2], contents[length // 2:], contents[length // 4: length // 4 * 3]
    quote1 = locate_quote(quote, contents1)
    quote2 = locate_quote(quote, contents2)
    quote3 = locate_quote(quote, contents3)
    if len(quote1):
        return quote1
    if len(quote2):
        return quote2
    if len(quote3):
        return quote3
    return ""


@function_tool
def make_note(name: str, text: str) -> str:
    with open(f"resources/{name}/notes.md", "a") as f:
        f.write("\n\n" + text)
    return "Note added"


# Agent

agent = Agent(
    name="Retrieval Agent",
    instructions=retrieve_agent_system_prompt,
    tools=[get_outline, get_subsection_paths, get_contents, locate_quote, make_note],
    model_settings=ModelSettings(metadata={}),
)


# Run Agent

def run(conversation: list[dict[str, str]], name: str) -> list[dict[str, str]]:
    user_message = f"""
DOCUMENT CURRENTLY VIEWED (i.e. "name")
=======================================
```
{name}
```

CONVERSATION SO FAR
===================
```
{json.dumps(conversation[:-1], indent=4)}
```

CURRENT MESSAGE
===============
```
{json.dumps(conversation[-1], indent=4)}
```
    """
    return Runner.run_streamed(
        starting_agent=agent,
        input=user_message,
        max_turns=1000,
    )
