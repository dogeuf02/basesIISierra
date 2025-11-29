# src/app/repositories/sql/category_repository.py

from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.sql_models import Category


class CategoryRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_categories(self) -> List[Category]:
        """
        Retorna todas las categorías ordenadas por nombre.
        """
        stmt = select(Category).order_by(Category.name)
        return self.db.execute(stmt).scalars().all()
