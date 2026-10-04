from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.database import create_db_and_tables
from app.api.routes import employees 

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="Salary Management System", lifespan=lifespan)

app.include_router(employees.router, prefix="/api/v1")
