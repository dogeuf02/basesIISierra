# src/app/services/category_services.py

from typing import List
from sqlalchemy.orm import Session

from app.repositories.sql.category_repository import CategoryRepository
from app.models.sql_models import Category


class CategoryService:

    def __init__(self, db: Session):
        self.repo = CategoryRepository(db)

    def list_categories(self) -> List[Category]:
        return self.repo.get_categories()
