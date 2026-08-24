# Plataforma WebGIS — Infraestruturas Críticas da Grande Florianópolis

MVP com backend FastAPI (persistência JSON) e frontend Next.js + MapLibre.

## Estrutura

```text
AIC/
├── BACKEND/   # API FastAPI
└── FRONTEND/  # Interface Next.js
```

## Pré-requisitos

- Python 3.11+
- Node.js 18+

## Como executar

### 1. Backend

```bash
cd BACKEND
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Documentação: http://127.0.0.1:8091/docs

### 2. Frontend

```bash
cd FRONTEND
npm install
npm run dev
```

Aplicação: http://localhost:3000

## Funcionalidades do MVP

- Mapa interativo com 20 infraestruturas reais (seed automático)
- KPIs operacionais (total, OK, alerta, crítica)
- Filtros sincronizados entre mapa, KPIs e tabela
- Página de dados com busca e tabela completa
- Dashboard e Simulações preparados como placeholders

## Próximos passos

- Migrar persistência JSON → PostgreSQL/PostGIS
- Módulo de ocorrências e eventos
- Dashboard analítico e motor de simulações
