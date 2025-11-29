# src/app/repositories/sql/program_repository.py

from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.sql_models import Program


class ProgramRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_programs(self) -> List[Program]:
        """
        Retorna todos los programas académicos ordenados por nombre.
        """
        stmt = select(Program).order_by(Program.name)
        return self.db.execute(stmt).scalars().all()
