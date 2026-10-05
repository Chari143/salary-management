from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.database import create_db_and_tables
from app.api.routes import employees, salaries, analytics
from fastapi.middleware.cors import CORSMiddleware
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="Salary Management System", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router, prefix="/api/v1")
app.include_router(salaries.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
