from dotenv import load_dotenv
from flask import Flask, request
import json
from litellm import completion, RateLimitError
import os
import time

# Load env variables
load_dotenv()

# Create a Flask app instance
app = Flask(__name__)


# Function to handle rate limit errors
def wait_loop():
    print(f"We have hit the rate limits!")
    seconds = 15
    while seconds > 0:
        print(
            (
                f"Next try to call the API in {'' if seconds >= 10 else '0'}"
                f"{seconds} seconds"
            ),
            end="\r",
        )
        seconds -= 1
        time.sleep(1)


# Wrapper for the litellm completion function to retry on rate limit errors
def rate_limit_completion(*args, **kwargs):
    try:
        response = completion(*args, **kwargs)
        if kwargs.get("stream") == True:

            def stream_response():
                try:
                    for chunk in response:
                        yield f"data: {json.dumps(chunk.model_dump())}\n\n"
                except RateLimitError:
                    wait_loop()
                    yield from stream_response()

            return stream_response()
        return response.json()
    except RateLimitError:
        wait_loop()
        return rate_limit_completion(*args, **kwargs)


# Define a route for the root URL
@app.route("/chat/completions", methods=["POST"])
def chat():
    kwargs = request.json
    kwargs["model"] = "gemini/gemini-2.0-flash"
    tools = kwargs.get("tools")
    if tools is not None:
        for tool in tools:
            if tool["type"] == "function":
                properties, new_properties = (
                    tool["function"]["parameters"]["properties"],
                    dict(),
                )
                for param in tool["function"]["parameters"]["properties"]:
                    properties[param].pop("default", None)
                    new_properties[param] = properties[param]
                tool["function"]["parameters"]["properties"] = new_properties

    return rate_limit_completion(api_key=os.environ["GEMINI_API_KEY"], **kwargs)


# Run the app
if __name__ == "__main__":
    app.run(debug=True)
