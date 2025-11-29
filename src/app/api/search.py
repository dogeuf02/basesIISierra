# src/app/api/search.py

from fastapi import APIRouter, HTTPException
from app.services.search_services import SearchService
from app.models.schemas import SearchResultOut

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)

service = SearchService()


@router.get("/", response_model=list[SearchResultOut])
def search_resources(query: str):
    try:
        return service.search(query)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
