// ============================================
// UI STORE — Estado Global de Interface
// Responsabilidade: modais, notificações,
// tema, painel ativo, estado de carregamento
// ============================================

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type ThemeMode = 'dark' | 'light' | 'system';
export type PanelId =
  | 'aiAssistant' | 'furnitureCatalog' | 'projectManager'
  | 'templates' | 'quotation' | 'tour' | 'share' | 'settings'
  | 'scan' | 'collaboration' | 'commandPalette' | 'addRoom';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;       // ms, 0 = persistent
  createdAt: number;
}

export interface UIStoreState {
  // Panel / modal visibility
  openPanels: Set<PanelId>;
  theme: ThemeMode;

  // Loading states
  isGlobalLoading: boolean;
  loadingMessage: string;

  // Notifications (toast queue)
  notifications: Notification[];

  // Sidebar state
  isSidebarCollapsed: boolean;
  isPropertiesPanelOpen: boolean;

  // Actions — panels
  openPanel: (id: PanelId) => void;
  closePanel: (id: PanelId) => void;
  togglePanel: (id: PanelId) => void;
  isPanelOpen: (id: PanelId) => boolean;
  closeAllPanels: () => void;

  // Actions — theme
  setTheme: (theme: ThemeMode) => void;

  // Actions — loading
  setGlobalLoading: (loading: boolean, message?: string) => void;

  // Actions — notifications
  notify: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;

  // Actions — sidebar
  toggleSidebar: () => void;
  setPropertiesPanel: (open: boolean) => void;
}

export const useUIStore = create<UIStoreState>()(
  devtools(
    immer((set, get) => ({
      openPanels: new Set<PanelId>(),
      theme: 'dark' as ThemeMode,
      isGlobalLoading: false,
      loadingMessage: '',
      notifications: [],
      isSidebarCollapsed: false,
      isPropertiesPanelOpen: false,

      openPanel: (id) => set(state => { state.openPanels.add(id); }),
      closePanel: (id) => set(state => { state.openPanels.delete(id); }),
      togglePanel: (id) => set(state => {
        if (state.openPanels.has(id)) state.openPanels.delete(id);
        else state.openPanels.add(id);
      }),
      isPanelOpen: (id) => get().openPanels.has(id),
      closeAllPanels: () => set(state => { state.openPanels = new Set(); }),

      setTheme: (theme) => set(state => { state.theme = theme; }),

      setGlobalLoading: (loading, message = '') => set(state => {
        state.isGlobalLoading = loading;
        state.loadingMessage = message;
      }),

      notify: (notification) => {
        const id = uuidv4();
        set(state => {
          state.notifications.push({ ...notification, id, createdAt: Date.now() });
          // Keep max 5 notifications
          if (state.notifications.length > 5) {
            state.notifications = state.notifications.slice(-5);
          }
        });
        // Auto-dismiss after duration (default 4s)
        const duration = notification.duration ?? 4000;
        if (duration > 0) {
          setTimeout(() => get().dismissNotification(id), duration);
        }
        return id;
      },

      dismissNotification: (id) => set(state => {
        state.notifications = state.notifications.filter(n => n.id !== id);
      }),

      clearNotifications: () => set(state => { state.notifications = []; }),

      toggleSidebar: () => set(state => { state.isSidebarCollapsed = !state.isSidebarCollapsed; }),
      setPropertiesPanel: (open) => set(state => { state.isPropertiesPanelOpen = open; }),
    })),
    { name: 'UIStore' }
  )
);
