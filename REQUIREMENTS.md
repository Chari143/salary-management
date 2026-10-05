# Requirements — Salary Management

## Problem

HR team manages salary data for ~10,000 employees across multiple countries in Excel. It's slow, error-prone, and impossible to get any meaningful insight from. The ask was to build a web-based tool the HR Manager can actually use day-to-day.

---

## What I'm building

A single-page app where the HR Manager can:

- **View all employees** with search, department filter, and status filter (active/inactive)
- **Add an employee** with their initial base salary — these happen atomically, you can't have an employee without a salary
- **Edit employee details** — job title, department, level, or mark them as inactive (soft delete, not hard delete)
- **Track salary changes** — every raise or correction is a new entry with an effective date, history is preserved
- **See payroll analytics** — headcount, total payroll, average salary by department and by job level. All amounts are normalized to USD for consistent reporting.

---

## What I'm deliberately leaving out

**Authentication** — The brief says single HR Manager, no RBAC needed. Adding login would add complexity without changing what the assessment is actually testing.

**Variable pay / bonuses / equity** — Out of scope per the brief. Focusing on base salary.

**Live exchange rates** — Fixed rates per currency. Deterministic and reproducible. Calling an external FX API adds a network dependency and makes analytics non-deterministic. Not worth it here.

**Salary history audit log** — Each salary record already has a created_at timestamp and effective_date. That's effectively an audit trail. A separate log table is over-engineering at this stage.

**Pay equity / compliance analytics** — Listed as optional in the brief. The HR Manager persona is better served by straightforward headcount and payroll numbers first.

**Production deployment** — Running locally. Dockerizing + cloud hosting is infra work that doesn't demonstrate anything about the quality of the application itself.

---

## Data model (quick sketch)

```
Employee
  id, employee_number, first_name, last_name, email
  department_id, job_title, job_level (L1-L7)
  country, employment_type, status (ACTIVE/INACTIVE)
  hire_date, created_at, updated_at

Salary
  id, employee_id (FK)
  amount, currency, effective_date
  created_at
```

An employee can have multiple salary records. The "current salary" for any employee is whichever record has the latest effective_date.

---

## Tech choices

**FastAPI** — Quick to set up, automatic OpenAPI docs, Pydantic schemas handle validation cleanly.

**SQLite** — Zero config for local dev. Relational, supports everything we need. Would swap to Postgres in production.

**Repository pattern** — Keeps all DB logic out of the route handlers. This makes it easy to unit test business logic by swapping the DB for an in-memory SQLite instance.

**Next.js App Router** — TypeScript, server components where sensible, no extra state management library needed at this scale.

---

## Out of scope (summary)

Auth, variable pay, live FX rates, audit log, pay equity analysis, production deployment.
