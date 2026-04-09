# AuriPlan — Architecture Documentation

> Interior Design SaaS Platform · React + Vite + TypeScript · Dark Premium UI

---

## Overview

AuriPlan is a browser-based 2D/3D interior design and floor plan editor. Users can draw rooms, place furniture, scan physical spaces with a camera, generate floor plans via natural language (AI), and export projects.

---

## Directory Structure

```
artifacts/auriplan/
├── src/
│   ├── app/
│   │   └── App.tsx            # Root: routing, all dashboard pages, InnerApp orchestrator
│   ├── features/
│   │   ├── editor/            # Main canvas editor feature
│   │   │   ├── Editor.tsx     # Top-level Editor component (header, toolbar, canvas, modals)
│   │   │   ├── index.ts       # Public exports
│   │   │   └── components/
│   │   │       ├── AIAssistant.tsx      # NL → floor plan generator UI
│   │   │       ├── Canvas2D.tsx         # 2D SVG/canvas drawing surface
│   │   │       ├── Canvas3D.tsx         # 3D Three.js viewport
│   │   │       ├── FurnitureCatalog.tsx # Drag-and-drop furniture library
│   │   │       ├── PropertiesPanel.tsx  # Selected object properties
│   │   │       ├── Sidebar.tsx          # Scene layers / project tree
│   │   │       ├── StatusBar.tsx        # Tool stats at bottom
│   │   │       ├── Toolbar.tsx          # Left tool palette (wall, door, etc.)
│   │   │       ├── ScanModal.tsx        # Camera scanner modal
│   │   │       ├── AddRoomModal.tsx     # Add room wizard
│   │   │       └── SettingsPanel.tsx    # Editor preferences
│   │   ├── collaboration/
│   │   │   └── CollaborationPanel.tsx   # Real-time collab (UI only, in overflow menu)
│   │   ├── quotation/
│   │   │   └── QuotationSystem.tsx      # Bill of materials / budget estimate
│   │   ├── share/
│   │   │   └── ShareSystem.tsx          # Export / share links
│   │   ├── templates/
│   │   │   └── TemplateGallery.tsx      # In-editor template picker
│   │   └── tour/
│   │       └── VirtualTour.tsx          # 360° virtual tour viewer
│   ├── engine/
│   │   └── floorplan/
│   │       └── FloorPlanGenerator.ts    # ABNT NL parser + architectural layout engine
│   ├── store/
│   │   ├── editorStore.ts               # Zustand store: canvas state, undo/redo, scenes
│   │   └── projectStore.ts              # Zustand store: project metadata
│   ├── components/
│   │   └── ui/
│   │       ├── CommandPalette.tsx        # ⌘K command palette
│   │       └── SimpleToast.tsx           # Toast notification system
│   └── types/
│       └── index.ts                      # Shared TypeScript types
├── docs/
│   └── ARCHITECTURE.md                   # This file
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## Module Map

### `App.tsx` — Application Shell

**Responsibilities:**
- Manages top-level view state: `'dashboard' | 'loading' | 'editor'`
- Contains all sidebar page components inline: `DashboardPage`, `ProjectsPage`, `TemplatesPage`, `LibraryPage`, `AIDesignPage`, `SettingsPage`
- `InnerApp` orchestrates navigation between pages and the editor
- Passes `openAIPromptOnMount` to `<Editor>` when dashboard AI input sends a prompt

**Key state in `InnerApp`:**
| State | Type | Purpose |
|-------|------|---------|
| `view` | `'dashboard' \| 'loading' \| 'editor'` | Top-level screen |
| `page` | `Page` | Active sidebar page |
| `openScanOnEnter` | `boolean` | Opens scan modal on editor entry |
| `pendingAIPrompt` | `string` | Prompt to pre-fill AIAssistant |

**Dashboard structure:**
1. Welcome heading
2. CTA buttons: "Novo Projeto" (gradient) + "Scanner 3D" (ghost)
3. AI input section ("✦ Gerar planta com IA") with text field + mic + send
4. Suggestion chips
5. Projetos Recentes (3-col grid)
6. Começar com Template (3-col grid, all 7 templates)

---

### `Editor.tsx` — Main Canvas Editor

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `onBack` | `() => void` | Returns to dashboard |
| `openScanOnMount` | `boolean?` | Auto-opens scan modal after 400ms |
| `openAIPromptOnMount` | `string?` | Auto-opens AIAssistant with prompt after 500ms |

**Header toolbar (left → right):**
1. Back button (← chevron)
2. Logo + project name
3. Flex spacer
4. Undo / Redo (hidden on sm)
5. Save (hidden on sm)
6. Divider
7. Scan (green gradient)
8. IA (purple-pink gradient)
9. Catálogo (blue, hidden on md)
10. Fullscreen toggle (hidden on mobile — `hidden md:flex`)
11. `...` Overflow menu

**Overflow menu items:** Colaborar, Templates, Orçamento, Tour Virtual, Compartilhar, Projetos, Configurações

**Key modal states:**
- `showAIAssistant` — AI floor plan generator panel
- `showScan` — Camera scan modal
- `isCatalogOpen` — Furniture catalog slide-over
- `showCollaboration` — Collaboration panel (accessed via overflow)
- `showTemplates` / `showQuotation` / `showTour` / `showShare` — Feature modals

---

### `FloorPlanGenerator.ts` — AI Layout Engine

**Location:** `src/engine/floorplan/FloorPlanGenerator.ts`

**Functions:**
- `parseDescription(text: string) → ParsedDescription` — NL parser extracting room count, types, area, style
- `generateFloorPlan(parsed: ParsedDescription) → GeneratedFloorPlan` — Architectural layout engine following ABNT NBR 15575 guidelines
- `applyFloorPlan(plan: GeneratedFloorPlan) → void` — Writes rooms/doors/windows to the Zustand editorStore

**Room types recognized:** bedroom (quarto/suíte), living room (sala), kitchen (cozinha), bathroom (banheiro), service area (área de serviço), garage (garagem), office (escritório), balcony (varanda)

---

### `AIAssistant.tsx` — Natural Language UI

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `onClose` | `() => void` | Closes the panel |
| `initialPrompt` | `string?` | Pre-fills and auto-generates |

**Phases:** `'input' → 'thinking' → 'preview' → 'done'`

**Flow:**
1. User types description (or receives `initialPrompt` from dashboard)
2. `parseDescription()` extracts room requirements
3. `generateFloorPlan()` calculates room layout (ABNT-compliant dimensions)
4. SVG blueprint preview rendered
5. User confirms → `applyFloorPlan()` populates the canvas

---

### `editorStore.ts` — Canvas State

**Built with:** Zustand with devtools

**Key slices:**
- `project` — Active project metadata
- `scenes[]` — List of floor plan scenes (floors/views)
- `currentSceneId` — Active scene reference
- `elements[]` — All canvas elements (walls, rooms, furniture, doors, windows)
- `selectedIds[]` — Currently selected element IDs
- `tool` — Active drawing tool (select, wall, room, door, window, measure, pan)
- `history` — Undo/redo stack
- `canUndo()` / `canRedo()` / `undo()` / `redo()`

---

## Navigation Flow

```
Dashboard
├── Click "Novo Projeto"  →  LoadingScreen (1.4s)  →  Editor (blank)
├── Click "Scanner 3D"    →  LoadingScreen  →  Editor + ScanModal (auto-open)
├── Click AI Send         →  LoadingScreen  →  Editor + AIAssistant (pre-filled prompt)
├── Click project card    →  LoadingScreen  →  Editor (project loaded)
├── Click template        →  LoadingScreen  →  Editor (template applied)
└── Sidebar: Projetos     →  ProjectsPage (6 cards with real images)
           Templates      →  TemplatesPage (7 templates in 3-col grid)
           Biblioteca     →  LibraryPage (furniture categories)
           AI Design      →  AIDesignPage (AI tool cards)
           Configurações  →  SettingsPage
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| State | Zustand |
| 3D Rendering | Three.js (via `Canvas3D`) |
| Icons | Lucide React |
| Monorepo | pnpm workspaces |

---

## Design System

- **Color palette:** Dark slate (`#0B1020`, `#111827`, `#1E293B`)
- **Accent:** Blue `#5B8CFF`, Purple `#8B5CF6`, Pink `#EC4899`
- **Success/Scan:** Emerald `#10B981` → Teal `#14B8A6`
- **Typography:** System sans-serif, white primary, `rgba(255,255,255,0.4)` secondary
- **Border radius:** `rounded-xl` (12px), `rounded-2xl` (16px) for cards
- **Sidebar width:** 156px (fixed position, spacer div keeps layout flow)

---

## Key Architectural Decisions

1. **Single-file pages**: Dashboard sub-pages (`DashboardPage`, `ProjectsPage`, etc.) live inline in `App.tsx` for simplicity since they share props and constants
2. **Prompt passing via props**: AI prompt flows `dashboard → InnerApp.pendingAIPrompt → Editor.openAIPromptOnMount → AIAssistant.initialPrompt` without global state mutation
3. **Fullscreen scoped to desktop**: `hidden md:flex` on the fullscreen button — irrelevant on mobile
4. **Colaborar in overflow**: Removes header clutter on mobile while keeping the feature accessible
5. **ABNT-compliant generator**: `FloorPlanGenerator.ts` encodes Brazilian architectural norms (NBR 15575) for minimum room dimensions

