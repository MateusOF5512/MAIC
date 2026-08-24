# Backend — WebGIS Infraestruturas Críticas

API FastAPI com persistência JSON para o MVP.

## Requisitos

- Python 3.11+

## Instalação

```bash
cd BACKEND
pip install -r requirements.txt
```

## Execução

```bash
python run.py
```

A documentação interativa fica em `http://127.0.0.1:8091/docs`.

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `DATA_FILE` | `./data/infrastructures.json` | Arquivo JSON de persistência |
| `CORS_ORIGINS` | `http://localhost:3000` | Origens permitidas (separadas por vírgula) |
| `API_PREFIX` | `/api/v1` | Prefixo das rotas da API |
| `PORT` | `8091` | Porta HTTP do backend |
| `HOST` | `127.0.0.1` | Host de bind do backend |

## Endpoints principais

- `GET /health`
- `GET /api/v1/kpis`
- `GET /api/v1/infrastructures`
- `GET /api/v1/infrastructures/geojson`
- `GET /api/v1/infrastructures/options/filters`
- `POST /api/v1/infrastructures`
- `PUT /api/v1/infrastructures/{id}`
- `PATCH /api/v1/infrastructures/{id}/status`

Os 20 registros iniciais são carregados automaticamente na primeira execução.
