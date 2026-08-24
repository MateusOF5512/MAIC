from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import dashboard, health, infrastructure, kpis, simulations
from app.core.config import get_settings
from seeds.infrastructure_seed import seed_infrastructure_data


@asynccontextmanager
async def lifespan(_: FastAPI):
    seed_infrastructure_data()
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Plataforma WebGIS — Infraestruturas Críticas",
        description="API para gestão de infraestruturas críticas da Grande Florianópolis",
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(kpis.router, prefix=settings.api_prefix)
    app.include_router(dashboard.router, prefix=settings.api_prefix)
    app.include_router(infrastructure.router, prefix=settings.api_prefix)
    app.include_router(simulations.router, prefix=settings.api_prefix)

    return app


app = create_app()
