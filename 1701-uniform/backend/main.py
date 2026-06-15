from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import models to register them with SQLAlchemy before create_all
import models  # noqa: F401
from database import engine, Base

# Create all tables
Base.metadata.create_all(bind=engine)

from routers import auth, users, cadets, items, stock, transactions, dashboard, audit
from routers import badges
from routers import feedback

app = FastAPI(
    title="1701 Squadron Uniform Inventory",
    description="Uniform stock management system for 1701 Air Cadet Squadron",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Tighten this in production to your specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(cadets.router)
app.include_router(items.router)
app.include_router(stock.router)
app.include_router(transactions.router)
app.include_router(dashboard.router)
app.include_router(audit.router)
app.include_router(badges.router)
app.include_router(feedback.router)


@app.get("/")
def root():
    return {"message": "1701 Squadron Uniform Inventory API", "status": "running"}
