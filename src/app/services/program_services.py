# src/app/services/program_services.py

from typing import List
from sqlalchemy.orm import Session

from app.repositories.sql.program_repository import ProgramRepository
from app.models.sql_models import Program


class ProgramService:

    def __init__(self, db: Session):
        self.repo = ProgramRepository(db)

    def list_programs(self) -> List[Program]:
        """
        Lógica de negocio para listar programas académicos.
        (Aquí podrías más adelante filtrar por facultad, etc.)
        """
        return self.repo.get_programs()
