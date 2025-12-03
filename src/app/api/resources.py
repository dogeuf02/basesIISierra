from typing import List
from fastapi import APIRouter, Depends, status, UploadFile, File, Query, Request
from sqlalchemy.orm import Session

from app.sql.database import get_db
from app.services.resource_services import ResourceService

from app.models.schemas import (
    ResourceOut,
    AuthorOut,
    CategoryOut,
    KeywordOut,
    ReviewOut,
    ReviewIn
)

router = APIRouter(
    prefix="/resources",
    tags=["Resources"]
)


# ======================================================
# GET /resources
# ======================================================
@router.get("/", response_model=List[ResourceOut])
def list_resources(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    service = ResourceService(db)
    return service.list_resources(skip, limit)


# ======================================================
# GET /resources/{resource_id}
# ======================================================
@router.get("/{resource_id}", response_model=ResourceOut)
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    service = ResourceService(db)
    return service.get_resource(resource_id)


# ======================================================
# GET /resources/{resource_id}/authors
# ======================================================
@router.get("/{resource_id}/authors", response_model=List[AuthorOut])
def get_authors(resource_id: int, db: Session = Depends(get_db)):
    service = ResourceService(db)
    return service.get_authors(resource_id)


# ======================================================
# GET /resources/{resource_id}/categories
# ======================================================
@router.get("/{resource_id}/categories", response_model=List[CategoryOut])
def get_categories(resource_id: int, db: Session = Depends(get_db)):
    service = ResourceService(db)
    return service.get_categories(resource_id)


# ======================================================
# GET /resources/{resource_id}/keywords
# ======================================================
@router.get("/{resource_id}/keywords", response_model=List[KeywordOut])
def get_keywords(resource_id: int, db: Session = Depends(get_db)):
    service = ResourceService(db)
    return service.get_keywords(resource_id)


# ======================================================
# GET /resources/{resource_id}/reviews
# ======================================================
@router.get("/{resource_id}/reviews", response_model=List[ReviewOut])
def get_reviews(resource_id: int, db: Session = Depends(get_db)):
    service = ResourceService(db)
    return service.get_reviews(resource_id)


# ======================================================
# POST /resources/{resource_id}/reviews
# ======================================================
@router.post(
    "/{resource_id}/reviews",
    response_model=ReviewOut,
    status_code=status.HTTP_201_CREATED
)
def add_review(
    resource_id: int,
    review_in: ReviewIn,
    db: Session = Depends(get_db)
):
    service = ResourceService(db)
    return service.add_review(
        resource_id=resource_id,
        user_id=review_in.user_id,
        rating=review_in.rating,
        comment=review_in.comment
    )
    
@router.post("/{resource_id}/upload")
async def upload_resource_file(
    resource_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    service = ResourceService(db)
    updated_resource = await service.upload_file(resource_id, file)
    return updated_resource

@router.get("/{resource_id}/file")
def download_resource_file(
    resource_id: int,
    user_id: int = Query(None),   # opcional
    request: Request = None,
    db: Session = Depends(get_db),
):
    service = ResourceService(db)

    # Obtener IP y user-agent
    client_ip = request.client.host if request and request.client else None
    user_agent = request.headers.get("user-agent", "unknown") if request else "unknown"

    # Clasificación muy simple de dispositivo
    ua_lower = user_agent.lower()
    if "mobile" in ua_lower:
        device = "mobile"
    elif "tablet" in ua_lower or "ipad" in ua_lower:
        device = "tablet"
    elif "windows" in ua_lower or "macintosh" in ua_lower or "linux" in ua_lower:
        device = "desktop"
    else:
        device = "other"

    metadata = {
        "ip": client_ip,
        "user_agent": user_agent,
        "device": device,
    }

    return service.download_file(resource_id, user_id, metadata)