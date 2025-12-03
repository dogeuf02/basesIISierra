# src/app/services/resource_services.py
import os
from typing import List, Optional
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session
import aiofiles
from fastapi.responses import FileResponse
from datetime import datetime
from app.nosql.mongo_db import mongo_db

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
        
    async def upload_file(self, resource_id: int, file: UploadFile):
        # 1. Validate resource exists
        resource = self.repo.get_resource(resource_id)
        if not resource:
            raise HTTPException(status_code=404, detail="Resource not found")

        # 2. Validate file type
        allowed_types = ["pdf", "epub"]
        ext = file.filename.split(".")[-1].lower()

        if ext not in allowed_types:
            raise HTTPException(status_code=400, detail=f"File type .{ext} not allowed")

        # 3. Create final path
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)

        final_path = f"{upload_dir}/{resource_id}.{ext}"

        # 4. Save file to disk
        async with aiofiles.open(final_path, "wb") as out_file:
            content = await file.read()
            await out_file.write(content)

        # 5. update sql record 
        updated = self.repo.update_file_info(
            resource_id=resource_id,
            file_path=final_path,
            file_type=ext,
            file_size=len(content)
        )

        return updated        

    def download_file(
        self,
        resource_id: int,
        user_id: Optional[int] = None,
        metadata: dict | None = None,
    ):
        # 1. verify existence of resource
        resource = self.repo.get_resource(resource_id)
        if not resource:
            raise HTTPException(status_code=404, detail="Resource not found")

        # 2. veryfy that resource has associated file
        if not resource.file_path:
            raise HTTPException(status_code=404, detail="Resource has no associated file")

        # 3. verify that file exists on disk
        if not os.path.exists(resource.file_path):
            raise HTTPException(status_code=404, detail="File not found on server")
        
        # 4. build enriched metadata
        base_metadata = {"source": "api_download"}
        if metadata:
            base_metadata.update(metadata)

        # 5. register download event in MongoDB
        mongo = mongo_db.get_database()
        mongo["log_events"].insert_one(
            {
                "type": "download",
                "user_id": user_id,
                "resource_id": resource_id,
                "timestamp": datetime.utcnow(),
                "metadata": base_metadata,
            }
        )

        # 6. return file response
        return FileResponse(
            resource.file_path,
            media_type=f"application/{resource.file_type}",
            filename=f"{resource.title}.{resource.file_type}",
        )