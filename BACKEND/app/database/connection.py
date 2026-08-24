"""Placeholder for future database connection (PostGIS migration)."""

from app.database.json_store import JsonStore


def get_json_store() -> JsonStore:
    return JsonStore()
