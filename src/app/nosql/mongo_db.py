import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.database import Database

load_dotenv()

class MongoDB:
    _instance = None
    _client: MongoClient | None = None
    _database: Database | None = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def connect(self):
        if self._client is None:
            mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
            db_name = os.getenv("MONGO_DB_NAME", "digital_library")

            self._client = MongoClient(mongo_url)
            self._database = self._client[db_name]

    def get_database(self) -> Database:
        if self._client is None or self._database is None:
            self.connect()
        return self._database

mongo_db = MongoDB()
