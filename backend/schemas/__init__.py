# schemas.py
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class ArticleBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1, max_length=255)

    model_config = ConfigDict(from_attributes=True)


class ArticleCreate(ArticleBase):
    pass


class ArticleRead(ArticleBase):
    id: int
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)
