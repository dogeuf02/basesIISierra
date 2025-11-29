# src/app/api/stats.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.sql.database import get_db
from app.repositories.sql.daily_stats_repository import DailyStatsRepository
from app.models.sql_models import DailyStats


router = APIRouter(
    prefix="/stats",
    tags=["Stats"]
)


@router.get("/latest")
def get_latest_stats(db: Session = Depends(get_db)):
    repo = DailyStatsRepository(db)
    stats = repo.get_latest()
    if not stats:
        raise HTTPException(status_code=404, detail="No stats found")
    return stats


@router.get("/{date}")
def get_stats_by_date(date: date, db: Session = Depends(get_db)):
    repo = DailyStatsRepository(db)
    stats = repo.get_by_date(date)
    if not stats:
        raise HTTPException(status_code=404, detail=f"No stats for {date}")
    return stats
