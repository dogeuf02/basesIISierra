# src/app/repositories/sql/resource_repository.py

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.sql_models import (
    Resource,
    Author,
    Category,
    Keyword,
    Review,
)


class ResourceRepository:

    def __init__(self, db: Session):
        self.db = db

    # ----------------------------------------
    # GET /resources
    # ----------------------------------------
    def get_resources(self, skip: int = 0, limit: int = 50) -> List[Resource]:
        stmt = select(Resource).offset(skip).limit(limit)
        return self.db.execute(stmt).scalars().all()

    # ----------------------------------------
    # GET /resources/{id}
    # ----------------------------------------
    def get_resource(self, resource_id: int) -> Optional[Resource]:
        stmt = select(Resource).where(Resource.resource_id == resource_id)
        return self.db.execute(stmt).scalar_one_or_none()

    # ----------------------------------------
    # GET /resources/{id}/authors
    # ----------------------------------------
    def get_authors_for_resource(self, resource_id: int) -> List[Author]:
        resource = self.get_resource(resource_id)
        if resource:
            return resource.authors
        return []

    # ----------------------------------------
    # GET /resources/{id}/categories
    # ----------------------------------------
    def get_categories_for_resource(self, resource_id: int) -> List[Category]:
        resource = self.get_resource(resource_id)
        if resource:
            return resource.categories
        return []

    # ----------------------------------------
    # GET /resources/{id}/keywords
    # ----------------------------------------
    def get_keywords_for_resource(self, resource_id: int) -> List[Keyword]:
        resource = self.get_resource(resource_id)
        if resource:
            return resource.keywords
        return []

    # ----------------------------------------
    # GET /resources/{id}/reviews
    # ----------------------------------------
    def get_reviews_for_resource(self, resource_id: int) -> List[Review]:
        stmt = select(Review).where(Review.resource_id == resource_id)
        return self.db.execute(stmt).scalars().all()

    # ----------------------------------------
    # POST /resources/{id}/reviews
    # ----------------------------------------
    def add_review(self, resource_id: int, user_id: int, rating: int, comment: Optional[str]) -> Review:
        new_review = Review(
            resource_id=resource_id,
            user_id=user_id,
            rating=rating,
            comment=comment
        )

        self.db.add(new_review)
        self.db.commit()
        self.db.refresh(new_review)

        return new_review
