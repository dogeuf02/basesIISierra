# src/app/batch/build_search_index.py

from sqlalchemy.orm import Session
from app.sql.database import SessionLocal
from app.models.sql_models import Resource
from app.nosql.mongo_db import mongo_db


def build_search_index():
    db: Session = SessionLocal()
    mongo = mongo_db.get_database()
    collection = mongo["search_index"]

    collection.delete_many({})  # limpiar todo

    resources = db.query(Resource).all()

    docs = []

    for r in resources:
        docs.append({
            "_id": r.resource_id,
            "resource_id": r.resource_id,
            "title": r.title,
            "authors": [a.name for a in r.authors],
            "categories": [c.name for c in r.categories],
            "keywords": [k.keyword for k in r.keywords],
            "year": r.publication_year if r.publication_year else 0
        })

    if docs:
        collection.insert_many(docs)

    print(f"Indexed {len(docs)} resources.")
