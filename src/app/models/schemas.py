# src/app/models/schemas.py

from typing import Optional, List
from datetime import datetime, date

from pydantic import BaseModel, Field, ConfigDict


# ======================================================
# PROGRAM & USER
# ======================================================

class ProgramOut(BaseModel):
    program_id: int
    name: str
    faculty: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class AppUserOut(BaseModel):
    user_id: int
    name: str
    email: str
    role: str
    program_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ======================================================
# RESOURCE
# ======================================================

class ResourceOut(BaseModel):
    resource_id: int
    title: str
    description: Optional[str] = None
    publication_year: Optional[int] = None
    resource_type: str
    language: Optional[str] = None
    license_id: Optional[int] = None
    created_at: datetime
    file_path: Optional[str] = None
    file_type: Optional[str] = None
    file_size: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


# ======================================================
# AUTHOR
# ======================================================

class AuthorOut(BaseModel):
    author_id: int
    name: str
    affiliation: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# ======================================================
# CATEGORY
# ======================================================

class CategoryOut(BaseModel):
    category_id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


# ======================================================
# KEYWORD
# ======================================================

class KeywordOut(BaseModel):
    keyword_id: int
    keyword: str

    model_config = ConfigDict(from_attributes=True)


# ======================================================
# REVIEW
# ======================================================

class ReviewIn(BaseModel):
    """
    Modelo de entrada para crear una reseña (POST /resources/{id}/reviews)
    """
    user_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewOut(BaseModel):
    review_id: int
    resource_id: int
    user_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ======================================================
#  MODELOS PARA STATS
# ======================================================

class DailyStatsOut(BaseModel):
    date: date
    total_events: int
    top_downloads: list
    top_search_terms: list


# ======================================================
# LOG EVENTS (Mongo)
# ======================================================

class LogMetadata(BaseModel):
    ip: Optional[str] = None
    device: Optional[str] = None
    user_agent: Optional[str] = None
    source: Optional[str] = None


class LogEventIn(BaseModel):
    type: str  # search, download, view
    user_id: int
    resource_id: Optional[int] = None
    query: Optional[str] = None
    metadata: Optional[LogMetadata] = None


class LogEventOut(BaseModel):
    id: str
    type: str
    user_id: int
    resource_id: Optional[int]
    query: Optional[str]
    timestamp: datetime

    # Always provide metadata, even if empty in BD
    metadata: LogMetadata = Field(default_factory=LogMetadata)
    
class LogEvent(BaseModel):
    type: str
    user_id: Optional[int] = None
    resource_id: Optional[int] = None
    query: Optional[str] = None
    timestamp: datetime
    metadata: Optional[LogMetadata] = None

    class Config:
        orm_mode = True

# ======================================================
# SEARCH INDEX
# ======================================================

class SearchResultOut(BaseModel):
    resource_id: int
    title: str
    authors: List[str]
    categories: List[str]
    keywords: List[str]
    year: int
