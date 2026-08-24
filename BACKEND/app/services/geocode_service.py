import re
from dataclasses import dataclass
from functools import lru_cache

import httpx
from fastapi import HTTPException, status

CEP_PATTERN = re.compile(r"^\d{8}$")
VIACEP_URL = "https://viacep.com.br/ws/{cep}/json/"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "AIC-WebGIS/0.1 (infraestruturas-criticas)"


@dataclass(frozen=True)
class GeocodedLocation:
    cep: str
    latitude: float
    longitude: float
    address: str | None


class GeocodeService:
    def geocode_cep(self, raw_cep: str) -> GeocodedLocation:
        cep = self._normalize_cep(raw_cep)
        return self._geocode_cached(cep)

    @staticmethod
    def _normalize_cep(raw_cep: str) -> str:
        cep = re.sub(r"\D", "", raw_cep.strip())
        if not CEP_PATTERN.match(cep):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CEP inválido. Informe 8 dígitos.",
            )
        return cep

    @staticmethod
    @lru_cache(maxsize=256)
    def _geocode_cached(cep: str) -> GeocodedLocation:
        via_cep_data = GeocodeService._fetch_via_cep(cep)
        latitude, longitude = GeocodeService._fetch_coordinates(cep, via_cep_data)
        formatted_cep = f"{cep[:5]}-{cep[5:]}"
        address = GeocodeService._format_address(via_cep_data)
        return GeocodedLocation(
            cep=formatted_cep,
            latitude=latitude,
            longitude=longitude,
            address=address,
        )

    @staticmethod
    def _fetch_via_cep(cep: str) -> dict:
        try:
            with httpx.Client(timeout=10.0) as client:
                response = client.get(VIACEP_URL.format(cep=cep))
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Não foi possível consultar o CEP.",
            ) from exc

        if data.get("erro"):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CEP não encontrado.",
            )
        return data

    @staticmethod
    def _fetch_coordinates(cep: str, via_cep_data: dict) -> tuple[float, float]:
        headers = {"User-Agent": USER_AGENT}

        try:
            with httpx.Client(timeout=10.0, headers=headers) as client:
                postal_response = client.get(
                    NOMINATIM_URL,
                    params={
                        "postalcode": cep,
                        "country": "Brazil",
                        "format": "json",
                        "limit": 1,
                    },
                )
                postal_response.raise_for_status()
                postal_results = postal_response.json()
                if postal_results:
                    return float(postal_results[0]["lat"]), float(postal_results[0]["lon"])

                query = GeocodeService._build_nominatim_query(via_cep_data)
                if not query:
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail="Não foi possível geocodificar o CEP.",
                    )

                text_response = client.get(
                    NOMINATIM_URL,
                    params={"q": query, "format": "json", "limit": 1, "countrycodes": "br"},
                )
                text_response.raise_for_status()
                text_results = text_response.json()
                if not text_results:
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail="Não foi possível geocodificar o CEP.",
                    )
                return float(text_results[0]["lat"]), float(text_results[0]["lon"])
        except HTTPException:
            raise
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Não foi possível geocodificar o CEP.",
            ) from exc

    @staticmethod
    def _build_nominatim_query(via_cep_data: dict) -> str | None:
        parts = [
            via_cep_data.get("logradouro"),
            via_cep_data.get("bairro"),
            via_cep_data.get("localidade"),
            via_cep_data.get("uf"),
            "Brasil",
        ]
        query = ", ".join(part for part in parts if part)
        return query or None

    @staticmethod
    def _format_address(via_cep_data: dict) -> str | None:
        street = via_cep_data.get("logradouro")
        neighborhood = via_cep_data.get("bairro")
        city = via_cep_data.get("localidade")
        state = via_cep_data.get("uf")

        parts = [street, neighborhood]
        location = " - ".join(part for part in [city, state] if part)
        if location:
            parts.append(location)

        address = ", ".join(part for part in parts if part)
        return address or None
