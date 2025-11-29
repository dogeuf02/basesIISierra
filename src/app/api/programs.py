# src/app/api/programs.py

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.sql.database import get_db
from app.services.program_services import ProgramService
from app.models.schemas import ProgramOut
from app.models.sql_models import Program

router = APIRouter(
    prefix="/programs",
    tags=["Programs"]
)


@router.get("/", response_model=List[ProgramOut])
def list_programs(db: Session = Depends(get_db)):
    service = ProgramService(db)
    programs: List[Program] = service.list_programs()
    return programs
