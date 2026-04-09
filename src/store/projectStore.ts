// ============================================
// PROJECT STORE — Estado de Projetos Persistido
// Responsabilidade: lista de projetos, CRUD,
// favoritos, histórico de acesso recente
// ============================================

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface ProjectMeta {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  floors: number;
  area?: number;
  isFavorite: boolean;
  tags: string[];
  ownerId: string;
}

export interface ProjectStoreState {
  projects: ProjectMeta[];
  recentIds: string[];        // Last 10 accessed project IDs (ordered)
  activeProjectId: string | null;

  // Actions
  createProject: (name: string, description?: string, ownerId?: string) => ProjectMeta;
  deleteProject: (id: string) => void;
  updateProject: (id: string, patch: Partial<ProjectMeta>) => void;
  toggleFavorite: (id: string) => void;
  setActive: (id: string | null) => void;
  addToRecent: (id: string) => void;
  getRecent: () => ProjectMeta[];
  getFavorites: () => ProjectMeta[];
  search: (query: string) => ProjectMeta[];
}

export const useProjectStore = create<ProjectStoreState>()(
  devtools(
    persist(
      immer((set, get) => ({
        projects: [
          {
            id: '1', name: 'Sala Moderna', description: 'Projeto residencial 3 quartos',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString(),
            floors: 1, area: 45, isFavorite: true, tags: ['residencial'], ownerId: 'user-1',
          },
          {
            id: '2', name: 'Apartamento T2', description: '2 quartos com varanda',
            createdAt: new Date(Date.now() - 345600000).toISOString(),
            updatedAt: new Date(Date.now() - 172800000).toISOString(),
            floors: 1, area: 68, isFavorite: false, tags: ['apartamento'], ownerId: 'user-1',
          },
          {
            id: '3', name: 'Escritório Home', description: 'Home office moderno',
            createdAt: new Date(Date.now() - 777600000).toISOString(),
            updatedAt: new Date(Date.now() - 604800000).toISOString(),
            floors: 1, area: 22, isFavorite: false, tags: ['comercial', 'escritório'], ownerId: 'user-1',
          },
        ],
        recentIds: ['1', '2', '3'],
        activeProjectId: null,

        createProject: (name, description = '', ownerId = 'user-1') => {
          const project: ProjectMeta = {
            id: uuidv4(), name, description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            floors: 1, isFavorite: false, tags: [], ownerId,
          };
          set(state => { state.projects.unshift(project); });
          get().addToRecent(project.id);
          return project;
        },

        deleteProject: (id) => {
          set(state => {
            state.projects = state.projects.filter(p => p.id !== id);
            state.recentIds = state.recentIds.filter(rid => rid !== id);
            if (state.activeProjectId === id) state.activeProjectId = null;
          });
        },

        updateProject: (id, patch) => {
          set(state => {
            const idx = state.projects.findIndex(p => p.id === id);
            if (idx !== -1) {
              Object.assign(state.projects[idx], patch, { updatedAt: new Date().toISOString() });
            }
          });
        },

        toggleFavorite: (id) => {
          set(state => {
            const p = state.projects.find(p => p.id === id);
            if (p) p.isFavorite = !p.isFavorite;
          });
        },

        setActive: (id) => {
          set(state => { state.activeProjectId = id; });
          if (id) get().addToRecent(id);
        },

        addToRecent: (id) => {
          set(state => {
            state.recentIds = [id, ...state.recentIds.filter(rid => rid !== id)].slice(0, 10);
          });
        },

        getRecent: () => {
          const { projects, recentIds } = get();
          return recentIds
            .map(id => projects.find(p => p.id === id))
            .filter(Boolean) as ProjectMeta[];
        },

        getFavorites: () => get().projects.filter(p => p.isFavorite),

        search: (query) => {
          const q = query.toLowerCase();
          return get().projects.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q))
          );
        },
      })),
      { name: 'auriplan-projects', version: 1 }
    ),
    { name: 'ProjectStore' }
  )
);
