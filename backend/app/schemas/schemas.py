from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class TokenBase(BaseModel):
    access_token: str
    token_type: str

class Token(TokenBase):
    pass

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ArticleBase(BaseModel):
    title: str
    content: str
    tags: List[str] = []

class ArticleCreate(ArticleBase):
    pass

class Article(ArticleBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True