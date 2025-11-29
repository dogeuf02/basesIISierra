# src/app/services/search_services.py

from typing import List
from app.repositories.nosql.search_repository import SearchRepository


class SearchService:

    def __init__(self):
        self.repo = SearchRepository()

    def search(self, query: str) -> List[dict]:
        if not query or len(query) < 2:
            raise ValueError("Query must be at least 2 characters.")
        return self.repo.search(query)
