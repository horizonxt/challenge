# models.py
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field


class Article(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1, max_length=255)
    createdAt: datetime = Field(default_factory=datetime.now)
