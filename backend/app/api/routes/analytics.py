from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.repositories.analytics_repo import AnalyticsRepository

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_analytics_overview(db: Session = Depends(get_db)):
    repo = AnalyticsRepository(db)
    return repo.get_overview()
