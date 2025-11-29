# src/app/repositories/sql/daily_stats_repository.py

from sqlalchemy.orm import Session
from app.models.sql_models import DailyStats


class DailyStatsRepository:

    def __init__(self, db: Session):
        self.db = db

    def upsert_stats(self, stats: DailyStats):
        # Si ya existe → actualizar
        existing = self.db.query(DailyStats).filter(DailyStats.date == stats.date).first()

        if existing:
            existing.total_events = stats.total_events
            existing.top_search_terms = stats.top_search_terms
            existing.top_downloads = stats.top_downloads
        else:
            self.db.add(stats)

        self.db.commit()

    def get_latest(self):
        return self.db.query(DailyStats).order_by(DailyStats.date.desc()).first()

    def get_by_date(self, date):
        return self.db.query(DailyStats).filter(DailyStats.date == date).first()
