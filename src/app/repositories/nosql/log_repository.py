# src/app/repositories/nosql/log_repository.py

from datetime import datetime
from typing import List
from bson import ObjectId

from app.nosql.mongo_db import mongo_db
from app.models.schemas import LogEventIn


class LogRepository:

    def __init__(self):
        db = mongo_db.get_database()
        self.collection = db["log_events"]

    # ---------------------------------------------------
    # INSERT
    # ---------------------------------------------------
    def insert_log(self, log: LogEventIn) -> str:
        doc = {
            "type": log.type,
            "user_id": log.user_id,
            "resource_id": log.resource_id,
            "query": log.query,
            "timestamp": datetime.utcnow(),
            "metadata": log.metadata.model_dump()
        }

        result = self.collection.insert_one(doc)
        return str(result.inserted_id)

    # ---------------------------------------------------
    # QUERY BY USER
    # ---------------------------------------------------
    def get_logs_by_user(self, user_id: int):
        cursor = self.collection.find(
            {"user_id": user_id},
            {"_id": 0}   # quitamos el ObjectId
        )
        return list(cursor)
    # ---------------------------------------------------
    # QUERY BY RESOURCE
    # ---------------------------------------------------
    def get_logs_by_resource(self, resource_id: int):
        cursor = self.collection.find(
            {"resource_id": resource_id},
            {"_id": 0}
        )
        return list(cursor)

    # ---------------------------------------------------
    # FORMAT for API
    # ---------------------------------------------------
    def _format_logs(self, logs: List[dict]) -> List[dict]:
        formatted = []
        for log in logs:
            formatted.append({
                "id": str(log["_id"]),
                "type": log["type"],
                "user_id": log["user_id"],
                "resource_id": log.get("resource_id"),
                "query": log.get("query"),
                "timestamp": log["timestamp"],
                "metadata": log["metadata"]
            })
        return formatted
