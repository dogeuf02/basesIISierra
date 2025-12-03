# src/app/api/logs.py

from fastapi import APIRouter, HTTPException

from app.services.log_services import LogService
from app.models.schemas import LogEventIn, LogEventOut, LogEvent
from typing import List

router = APIRouter(
    prefix="/logs",
    tags=["Logs"]
)

service = LogService()


# ---------------------------------------------
# GENERAL LOG ENDPOINT
# ---------------------------------------------
@router.post("/", response_model=dict)
def log_event(event: LogEventIn):
    try:
        log_id = service.log_event(event)
        return {"id": log_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------------------------------------------
# BY USER
# ---------------------------------------------
@router.get("/user/{user_id}", response_model=List[LogEvent])
def get_logs_user(user_id: int):
    service = LogService()
    return service.get_logs_by_user(user_id)



# ---------------------------------------------
# BY RESOURCE
# ---------------------------------------------
@router.get("/resource/{resource_id}", response_model=List[LogEvent])
def get_logs_resource(resource_id: int):
    service = LogService()
    return service.get_logs_by_resource(resource_id)