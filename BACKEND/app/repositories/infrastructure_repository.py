from abc import ABC, abstractmethod
from typing import Any

from app.schemas.infrastructure import (
    InfrastructureCreate,
    InfrastructureFilter,
    InfrastructureStatusPatch,
    InfrastructureUpdate,
)


class InfrastructureRepository(ABC):
    @abstractmethod
    def list_all(self, filters: InfrastructureFilter | None = None) -> list[dict[str, Any]]:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, infrastructure_id: str) -> dict[str, Any] | None:
        raise NotImplementedError

    @abstractmethod
    def create(self, data: InfrastructureCreate) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    def update(self, infrastructure_id: str, data: InfrastructureUpdate) -> dict[str, Any] | None:
        raise NotImplementedError

    @abstractmethod
    def update_status(
        self, infrastructure_id: str, data: InfrastructureStatusPatch
    ) -> dict[str, Any] | None:
        raise NotImplementedError

    @abstractmethod
    def count_by_status(self, filters: InfrastructureFilter | None = None) -> dict[str, int]:
        raise NotImplementedError
