# src/app/repositories/nosql/search_repository.py

from typing import List
from pymongo import ASCENDING
from app.nosql.mongo_db import mongo_db


class SearchRepository:

    def __init__(self):
        db = mongo_db.get_database()
        self.collection = db["search_index"]

        # CREAR TEXT INDEX tal como lo exige tu estructura
        self.collection.create_index(
            [
                ("title", "text"),
                ("authors", "text"),
                ("categories", "text"),
                ("keywords", "text")
            ]
        )

    # ---------------------------------------------------
    # BUSCAR EN SEARCH INDEX
    # ---------------------------------------------------
    def search(self, query: str) -> List[dict]:
        cursor = self.collection.find(
            { "$text": { "$search": query } },
            { "score": { "$meta": "textScore" } }
        ).sort("score", ASCENDING)

        results = []
        for item in cursor:
            results.append({
                "resource_id": item["resource_id"],
                "title": item["title"],
                "authors": item["authors"],
                "categories": item["categories"],
                "keywords": item["keywords"],
                "year": item["year"]
            })
        return results
