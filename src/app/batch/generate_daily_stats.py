# src/app/batch/generate_daily_stats.py

from datetime import datetime, date, timedelta
from collections import Counter

from sqlalchemy.orm import Session
from app.sql.database import SessionLocal

from app.nosql.mongo_db import mongo_db
from app.models.sql_models import DailyStats


def generate_daily_stats():
    print(">>> Ejecutando batch de Daily Stats")

    # -----------------------------
    # 1. Get today logs from MongoDB (FIXED)
    # -----------------------------
    today = date.today()

    start = datetime.combine(today, datetime.min.time())
    end = start + timedelta(days=1)

    mongo = mongo_db.get_database()
    logs = list(mongo["log_events"].find({
        "timestamp": {
            "$gte": start,
            "$lt": end
        }
    }))

    print(f"Processing {len(logs)} logs for {today}")

    total_events = len(logs)

    # -----------------------------
    # 2. Top search terms
    # -----------------------------
    search_terms = [
        log.get("query")
        for log in logs
        if log["type"] == "search" and log.get("query")
    ]
    top_search = Counter(search_terms).most_common(5)

    # -----------------------------
    # 3. Top downloads
    # -----------------------------
    download_ids = [
        log.get("resource_id")
        for log in logs
        if log["type"] == "download" and log.get("resource_id") is not None
    ]
    top_downloads = Counter(download_ids).most_common(5)

    # -----------------------------
    # 4. insert/update in SQL
    # -----------------------------
    db: Session = SessionLocal()

    stats = DailyStats(
        date=today,
        total_events=total_events,
        top_search_terms=top_search,
        top_downloads=top_downloads,
    )

    from app.repositories.sql.daily_stats_repository import DailyStatsRepository
    repo = DailyStatsRepository(db)
    repo.upsert_stats(stats)

    print("Daily stats saved.")


if __name__ == "__main__":
    generate_daily_stats()
