# Frontend — WebGIS Infraestruturas Críticas

Interface Next.js para visualização de infraestruturas críticas da Grande Florianópolis.

## Requisitos

- Node.js 18+
- Backend FastAPI em execução

## Instalação

```bash
cd FRONTEND
npm install
```

## Execução

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:8091` | URL base da API |

## Rotas

- `/mapa` — mapa interativo com KPIs e filtros
- `/dados` — tabela de infraestruturas
- `/dashboard` — em construção
- `/simulacoes` — em construção
