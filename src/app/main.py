from fastapi import FastAPI
from app.api.resources import router as resources_router

app = FastAPI(
    title="Biblioteca Digital Universitaria",
    version="0.1.0",
)

app.include_router(resources_router)


@app.get("/")
def root():
    return {"status": "ok", "message": "API de Biblioteca Digital funcionando 🚀"}
