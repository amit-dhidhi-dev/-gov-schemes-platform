import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, schemes, applications, eligibility, chatbot, seo
from app.db.database import engine
from app.models import models
from app.services.scheduler import start_scheduler, stop_scheduler

# Create all tables
models.Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start our scraping cron engine
    start_scheduler()
    yield
    # Shutdown: Stop the cron engine cleanly
    stop_scheduler()

app = FastAPI(
    title="Govt Schemes Platform API",
    description="API for discovering, checking eligibility, and applying for Indian Government Schemes",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(schemes.router)
app.include_router(applications.router)
app.include_router(eligibility.router)
app.include_router(chatbot.router)
app.include_router(seo.router)

@app.get("/")
def root():
    return {
        "message": "🏛️ Government Schemes Platform API",
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
