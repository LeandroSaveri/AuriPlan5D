# AuriPlan — Interior Design Planner

**SaaS premium de planejamento de interiores** — design de ambientes em 2D/3D, assistente IA, scanner AR, tour virtual, colaboração e muito mais.

## Funcionalidades

| # | Feature | Status |
|---|---|---|
| 1 | Dashboard com projetos recentes | ✅ |
| 2 | Editor 2D (paredes, cômodos, portas, janelas) | ✅ |
| 3 | Visualizador 3D (Three.js PBR) | ✅ |
| 4 | Assistente IA (NLP → planta ABNT) | ✅ |
| 5 | Catálogo de Móveis (500+ itens) | ✅ |
| 6 | Scanner AR (câmera → planta automática) | ✅ |
| 7 | Tour Virtual 360° | ✅ |
| 8 | Galeria de Templates | ✅ |
| 9 | Sistema de Orçamento | ✅ |
| 10 | Compartilhamento com link/senha | ✅ |
| 11 | Export PDF / PNG / SVG / OBJ | ✅ |
| 12 | Auto-save (30s) | ✅ |
| 13 | Histórico Undo/Redo ilimitado | ✅ |
| 14 | Command Palette (Ctrl+K) | ✅ |
| 15 | Configurações (tema, grid, snap) | ✅ |
| 16 | Colaboração em tempo real (stub WebSocket) | ✅ |

## Tecnologias

- **React 18** + **TypeScript 5** — UI e tipo seguro
- **Vite 6** — Build ultrarrápido com HMR
- **Tailwind CSS v4** — Estilização utility-first
- **Zustand 5** + **Immer** — Estado global reativo
- **Framer Motion 11** — Animações fluidas
- **Three.js** + **React Three Fiber** — 3D
- **Lucide React** — Ícones
- **jsPDF** + **html2canvas** — Export PDF/PNG

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm run dev

# Build de produção
pnpm run build

# Verificar tipos
pnpm run type-check
```

## Estrutura do Projeto

```
src/
├── app/              # Roteador, providers, layout global
├── features/         # Módulos por funcionalidade
│   ├── editor/       # Editor 2D/3D completo
│   ├── dashboard/    # Dashboard inicial
│   ├── auth/         # Login/Cadastro
│   ├── templates/    # Galeria de templates
│   ├── quotation/    # Sistema de orçamento
│   ├── tour/         # Tour virtual
│   ├── share/        # Compartilhamento
│   └── collaboration/# Colaboração em tempo real
├── engine/           # Lógica de negócio pura (sem React)
├── model/            # Modelos de domínio imutáveis
├── store/            # Zustand stores
├── components/       # Primitivos UI reutilizáveis
├── lib/              # Integrações externas (AI, export, scanner)
├── types/            # TypeScript types compartilhados
└── utils/            # Utilitários puros
```

Consulte `docs/ARCHITECTURE.md` para detalhes técnicos completos.  
Consulte `docs/FEATURES.md` para documentação de cada funcionalidade.

## Atalhos do Editor

| Tecla | Ação |
|---|---|
| `V` | Ferramenta Selecionar |
| `W` | Ferramenta Parede |
| `R` | Ferramenta Cômodo |
| `D` | Ferramenta Porta |
| `J` | Ferramenta Janela |
| `M` | Ferramenta Medida |
| `Ctrl+Z` | Desfazer |
| `Ctrl+Y` | Refazer |
| `Ctrl+S` | Salvar |
| `Ctrl+K` | Command Palette |

## Variáveis de Ambiente

```env
VITE_WS_URL=wss://seu-servidor/collab   # WebSocket para colaboração real (opcional)
```

## Licença

Proprietário — AuriPlan © 2025
