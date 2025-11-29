# src/app/services/resource_services.py

from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.sql.resource_repository import ResourceRepository
from app.models.sql_models import (
    Resource,
    Author,
    Category,
    Keyword,
    Review
)


class ResourceService:

    def __init__(self, db: Session):
        self.repo = ResourceRepository(db)

    # ---------------------------------------------------
    # LIST RESOURCES
    # ---------------------------------------------------
    def list_resources(self, skip: int = 0, limit: int = 50) -> List[Resource]:
        return self.repo.get_resources(skip, limit)

    # ---------------------------------------------------
    # GET 1 RESOURCE
    # ---------------------------------------------------
    def get_resource(self, resource_id: int) -> Resource:
        resource = self.repo.get_resource(resource_id)
        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resource {resource_id} not found"
            )
        return resource

    # ---------------------------------------------------
    # AUTHORS
    # ---------------------------------------------------
    def get_authors(self, resource_id: int) -> List[Author]:
        resource = self.get_resource(resource_id)
        return resource.authors

    # ---------------------------------------------------
    # CATEGORIES
    # ---------------------------------------------------
    def get_categories(self, resource_id: int) -> List[Category]:
        resource = self.get_resource(resource_id)
        return resource.categories

    # ---------------------------------------------------
    # KEYWORDS
    # ---------------------------------------------------
    def get_keywords(self, resource_id: int) -> List[Keyword]:
        resource = self.get_resource(resource_id)
        return resource.keywords

    # ---------------------------------------------------
    # REVIEWS
    # ---------------------------------------------------
    def get_reviews(self, resource_id: int) -> List[Review]:
        self.get_resource(resource_id)  # valida existencia
        return self.repo.get_reviews_for_resource(resource_id)

    # ---------------------------------------------------
    # ADD REVIEW
    # ---------------------------------------------------
    def add_review(
        self,
        resource_id: int,
        user_id: int,
        rating: int,
        comment: Optional[str]
    ) -> Review:

        # Rule #1: resource must exist
        resource = self.get_resource(resource_id)

        # Rule #2: Rating between 1 and 5
        if rating < 1 or rating > 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rating must be between 1 and 5"
            )

        # Rule #3: not too long comment
        if comment and len(comment) > 500:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Comment too long (max 500 characters)"
            )



        # If all good, add the review
        return self.repo.add_review(
            resource_id=resource_id,
            user_id=user_id,
            rating=rating,
            comment=comment
        )
