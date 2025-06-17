from pydantic import BaseModel


class OutlineResponse(BaseModel):
    outline: str


class QuoteResponse(BaseModel):
    quotes: list[str]
    summary: str
