from sqlalchemy import (
    Column, Integer, String, Text, SmallInteger, ForeignKey, Date, TIMESTAMP,
    Table, text, Date, JSON)

from sqlalchemy.orm import relationship
from app.sql.database import Base


# ======================================================
# Secondary Tables (N:M)
# ======================================================

resource_author = Table(
    "resource_author",
    Base.metadata,
    Column("resource_id", Integer, ForeignKey("resource.resource_id", ondelete="CASCADE"), primary_key=True),
    Column("author_id", Integer, ForeignKey("author.author_id", ondelete="CASCADE"), primary_key=True),
)

resource_category = Table(
    "resource_category",
    Base.metadata,
    Column("resource_id", Integer, ForeignKey("resource.resource_id", ondelete="CASCADE"), primary_key=True),
    Column("category_id", Integer, ForeignKey("category.category_id", ondelete="CASCADE"), primary_key=True),
)

resource_keyword = Table(
    "resource_keyword",
    Base.metadata,
    Column("resource_id", Integer, ForeignKey("resource.resource_id", ondelete="CASCADE"), primary_key=True),
    Column("keyword_id", Integer, ForeignKey("keyword.keyword_id", ondelete="CASCADE"), primary_key=True),
)


# ======================================================
# Program
# ======================================================

class Program(Base):
    __tablename__ = "program"

    program_id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    faculty = Column(String(120), nullable=True)

    # Relationships
    users = relationship("AppUser", back_populates="program", lazy="select")


# ======================================================
# AppUser
# ======================================================

class AppUser(Base):
    __tablename__ = "app_user"

    user_id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), nullable=False, unique=True)
    role = Column(String(40), nullable=False, default="student")
    program_id = Column(Integer, ForeignKey("program.program_id"), nullable=True)
    created_at = Column(
    TIMESTAMP,
    nullable=False,
    server_default=text("NOW()")
)

    # Relationships
    program = relationship("Program", back_populates="users", lazy="select")
    reviews = relationship("Review", back_populates="user", lazy="select")


# ======================================================
# License
# ======================================================

class License(Base):
    __tablename__ = "license"

    license_id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)
    valid_from = Column(Date, nullable=True)
    valid_until = Column(Date, nullable=True)

    # Relationships
    resources = relationship("Resource", back_populates="license", lazy="select")


# ======================================================
# Resource
# ======================================================

class Resource(Base):
    __tablename__ = "resource"

    resource_id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    publication_year = Column(SmallInteger, nullable=True)
    resource_type = Column(String(40), nullable=False, default="book")
    language = Column(String(40), nullable=True)
    license_id = Column(Integer, ForeignKey("license.license_id"), nullable=True)
    created_at = Column(
    TIMESTAMP,
    nullable=False,
    server_default=text("NOW()")
    )
    
    # ================================
    # Files information
    # ================================
    file_path = Column(String, nullable=True)
    file_type = Column(String, nullable=True)   # pdf, epub, docx, etc.
    file_size = Column(Integer, nullable=True)  #  bytes 



    # Relationships
    license = relationship("License", back_populates="resources", lazy="select")
    authors = relationship("Author", secondary=resource_author, lazy="select")
    categories = relationship("Category", secondary=resource_category, lazy="select")
    keywords = relationship("Keyword", secondary=resource_keyword, lazy="select")
    reviews = relationship("Review", back_populates="resource", lazy="select")


# ======================================================
# Author
# ======================================================

class Author(Base):
    __tablename__ = "author"

    author_id = Column(Integer, primary_key=True)
    name = Column(String(180), nullable=False)
    affiliation = Column(String(180), nullable=True)

    # Relationship reverse for N:M
    resources = relationship("Resource", secondary=resource_author, lazy="select")


# ======================================================
# Category
# ======================================================

class Category(Base):
    __tablename__ = "category"

    category_id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False, unique=True)

    resources = relationship("Resource", secondary=resource_category, lazy="select")


# ======================================================
# Keyword
# ======================================================

class Keyword(Base):
    __tablename__ = "keyword"

    keyword_id = Column(Integer, primary_key=True)
    keyword = Column(String(120), nullable=False, unique=True)

    resources = relationship("Resource", secondary=resource_keyword, lazy="select")


# ======================================================
# Review
# ======================================================

class Review(Base):
    __tablename__ = "review"

    review_id = Column(Integer, primary_key=True)
    resource_id = Column(Integer, ForeignKey("resource.resource_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("app_user.user_id"), nullable=False)
    rating = Column(SmallInteger, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(
    TIMESTAMP,
    nullable=False,
    server_default=text("NOW()")
)

    resource = relationship("Resource", back_populates="reviews", lazy="select")
    user = relationship("AppUser", back_populates="reviews", lazy="select")

# ======================================================
# DW_DailyStats
# ======================================================

class DailyStats(Base):
    __tablename__ = "daily_stats"

    date = Column(Date, primary_key=True)
    total_events = Column(Integer, nullable=False)
    top_search_terms = Column(JSON, nullable=False)
    top_downloads = Column(JSON, nullable=False)
