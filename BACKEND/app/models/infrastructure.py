from enum import Enum


class InfrastructureStatus(str, Enum):
    OK = "OK"
    ALERTA = "ALERTA"
    CRITICA = "CRITICA"


class InfrastructureType(str, Enum):
    HOSPITAL = "Hospital"
    ESCOLA = "Escola"
    POLICIA_CIVIL = "Polícia Civil"
    POLICIA_MILITAR = "Polícia Militar"
    TRANSPORTE = "Transporte"
    AEROPORTO = "Aeroporto"
    PONTE_RODOVIA = "Ponte/Rodovia"
