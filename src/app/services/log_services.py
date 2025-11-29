# src/app/services/log_services.py

from typing import List
from app.models.schemas import LogEventIn
from app.repositories.nosql.log_repository import LogRepository


class LogService:

    def __init__(self):
        self.repo = LogRepository()

    def log_event(self, event: LogEventIn) -> str:
        # Validación simple
        if event.type not in ["search", "download", "view"]:
            raise ValueError("Invalid event type. Must be search|download|view.")

        return self.repo.insert_log(event)

    def get_logs_for_user(self, user_id: int) -> List[dict]:
        return self.repo.get_logs_by_user(user_id)

    def get_logs_for_resource(self, resource_id: int) -> List[dict]:
        return self.repo.get_logs_by_resource(resource_id)
