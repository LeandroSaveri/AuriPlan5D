// ============================================
// STORE INDEX — Exportação de Todos os Stores
// ============================================

// Editor state (scene, walls, rooms, furniture, tools, history)
export { useEditorStore } from './editorStore';
export type { EditorState } from './editorStore';

// Project list management (CRUD, favorites, recent)
export { useProjectStore } from './projectStore';
export type { ProjectMeta, ProjectStoreState } from './projectStore';

// Global UI state (modals, notifications, theme)
export { useUIStore } from './uiStore';
export type { UIStoreState, Notification, PanelId, ThemeMode } from './uiStore';
