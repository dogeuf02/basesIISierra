from fastapi import FastAPI
from app.api.resources import router as resources_router
from app.api.categories import router as categories_router
from app.api.programs import router as programs_router
from app.api.logs import router as logs_router
from app.api.search import router as search_router
from app.api.stats import router as stats_router

app = FastAPI(
    title="Biblioteca Digital Universitaria",
    version="0.1.0",
)

app.include_router(resources_router)
app.include_router(categories_router)
app.include_router(programs_router)
app.include_router(logs_router)
app.include_router(search_router)
app.include_router(stats_router)




@app.get("/")
def root():
    return {"status": "ok", "message": "API de Biblioteca Digital funcionando "}
