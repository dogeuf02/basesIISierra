# src/app/api/categories.py

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.sql.database import get_db
from app.services.category_services import CategoryService
from app.models.schemas import CategoryOut
from app.models.sql_models import Category

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)


@router.get("/", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    service = CategoryService(db)
    categories: List[Category] = service.list_categories()
    return categories
