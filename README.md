# Salary Management System

HR tool for managing compensation data for ~10,000 employees. Replaces the Excel workflow the team was using.

## Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind
- **Tests**: pytest, in-memory SQLite

## Running locally

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# seed data
python scripts/seed.py

uvicorn app.main:app --reload
```

API: `http://127.0.0.1:8000`
Swagger: `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:3000`

### Tests

```bash
cd backend
PYTHONPATH=. pytest tests -v
```

Uses an in-memory SQLite DB per test — no setup, no leftover state.

---

## What's in it

- Add / update / soft-delete employees
- Each employee has a salary history — raises are new records, nothing is overwritten
- Analytics: headcount, total payroll, average by department and job level, all normalized to USD
- Search by name, email, or employee ID (server-side, debounced 300ms)
- Filter by department and status
- Infinite scroll — 20 records at a time

## Implementation notes

**Repository pattern** — `employee_repo.py` and `analytics_repo.py` hold all DB logic. Routes are thin. This is what makes the tests simple to write — just inject an in-memory DB and go.

**Current salary resolution** — Analytics pick the salary with the latest `effective_date` per employee. If someone got a raise last month, that's the number used. The old record stays for history.

**Currency normalization** — Salaries are stored in their original currency. At query time they're multiplied by a fixed exchange rate to get USD. Fixed rates keep analytics deterministic — no external API calls, no flakiness.

**Atomic creation** — Adding an employee and their initial salary happens in a single DB transaction. You can't end up with an employee record that has no salary.

**Soft deletes** — Marking someone INACTIVE removes them from the default list but keeps all their data. You can still filter for them explicitly.
