// ============================================
// COLLABORATION SERVICE
// Responsabilidade: gerenciar sessão colaborativa
// via WebSocket (Yjs CRDT + y-websocket)
// Pronto para integrar com backend WS real
// ============================================

import { EventEmitter } from '@utils/EventEmitter';

export type CollabRole = 'owner' | 'editor' | 'viewer';
export type CollabPresenceColor =
  | '#5B8CFF' | '#22c55e' | '#f59e0b' | '#ef4444' | '#a78bfa';

export interface CollabUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: CollabPresenceColor;
  cursor?: { x: number; y: number };
  role: CollabRole;
  isOnline: boolean;
  lastSeen: string;
}

export interface CollabSession {
  id: string;
  projectId: string;
  owner: CollabUser;
  participants: CollabUser[];
  shareLink: string;
  shareToken: string;
  isPasswordProtected: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface CollabChange {
  userId: string;
  type: 'addWall' | 'deleteWall' | 'moveWall' | 'addRoom' | 'deleteRoom'
      | 'addFurniture' | 'deleteFurniture' | 'moveFurniture' | 'updateProps';
  payload: unknown;
  timestamp: number;
}

const CURSOR_COLORS: CollabPresenceColor[] = [
  '#5B8CFF', '#22c55e', '#f59e0b', '#ef4444', '#a78bfa',
];

const DEMO_PARTICIPANTS: CollabUser[] = [
  {
    id: 'u2', name: 'Ana Silva', email: 'ana@example.com',
    color: '#22c55e', role: 'editor', isOnline: true,
    lastSeen: new Date().toISOString(),
    cursor: { x: 320, y: 240 },
  },
  {
    id: 'u3', name: 'Carlos Melo', email: 'carlos@example.com',
    color: '#f59e0b', role: 'viewer', isOnline: false,
    lastSeen: new Date(Date.now() - 300000).toISOString(),
  },
];

// ── Service ────────────────────────────────────────────────────
class CollaborationService extends EventEmitter {
  private session: CollabSession | null = null;
  private localUser: CollabUser | null = null;
  private wsUrl: string = '';
  private connected = false;

  constructor() {
    super();
  }

  // Initialize with WS server URL (called on app start if WS is configured)
  init(wsUrl: string) {
    this.wsUrl = wsUrl;
  }

  // Start a new collaboration session for a project
  startSession(projectId: string, user: Omit<CollabUser, 'color' | 'isOnline' | 'lastSeen'>): CollabSession {
    const color = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
    this.localUser = { ...user, color, isOnline: true, lastSeen: new Date().toISOString() };

    this.session = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      projectId,
      owner: this.localUser,
      participants: DEMO_PARTICIPANTS,
      shareLink: `${window.location.origin}/share/${projectId}`,
      shareToken: Math.random().toString(36).slice(2, 12).toUpperCase(),
      isPasswordProtected: false,
      createdAt: new Date().toISOString(),
    };

    this.emit('sessionStarted', this.session);
    this._simulatePresence();
    return this.session;
  }

  // Connect to existing session via share token
  joinSession(token: string, user: Omit<CollabUser, 'color' | 'isOnline' | 'lastSeen'>): Promise<CollabSession> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!token || token.length < 4) {
          reject(new Error('Token inválido'));
          return;
        }
        const color = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
        this.localUser = { ...user, color, isOnline: true, lastSeen: new Date().toISOString() };
        if (this.session) {
          this.session.participants.push(this.localUser);
          resolve(this.session);
        } else {
          reject(new Error('Sessão não encontrada'));
        }
      }, 800);
    });
  }

  leaveSession() {
    if (this.session && this.localUser) {
      this.session.participants = this.session.participants.filter(
        p => p.id !== this.localUser!.id
      );
      this.emit('userLeft', this.localUser);
    }
    this.session = null;
    this.localUser = null;
    this.connected = false;
  }

  // Broadcast a change to all participants
  broadcastChange(change: Omit<CollabChange, 'userId' | 'timestamp'>) {
    if (!this.localUser) return;
    const full: CollabChange = {
      ...change,
      userId: this.localUser.id,
      timestamp: Date.now(),
    };
    this.emit('changeApplied', full);
  }

  // Update local user cursor position
  updateCursor(x: number, y: number) {
    if (this.localUser) {
      this.localUser.cursor = { x, y };
      this.emit('cursorMoved', { userId: this.localUser.id, x, y });
    }
  }

  // Generate new share link
  regenerateShareLink(): string {
    if (!this.session) return '';
    this.session.shareToken = Math.random().toString(36).slice(2, 12).toUpperCase();
    this.session.shareLink = `${window.location.origin}/share/${this.session.projectId}?t=${this.session.shareToken}`;
    return this.session.shareLink;
  }

  setPassword(password: string) {
    if (!this.session) return;
    this.session.isPasswordProtected = !!password;
    this.emit('sessionUpdated', this.session);
  }

  setExpiry(date: Date) {
    if (!this.session) return;
    this.session.expiresAt = date.toISOString();
    this.emit('sessionUpdated', this.session);
  }

  updateParticipantRole(userId: string, role: CollabRole) {
    if (!this.session) return;
    const p = this.session.participants.find(p => p.id === userId);
    if (p) {
      p.role = role;
      this.emit('roleChanged', { userId, role });
    }
  }

  removeParticipant(userId: string) {
    if (!this.session) return;
    this.session.participants = this.session.participants.filter(p => p.id !== userId);
    this.emit('userRemoved', userId);
  }

  getSession() { return this.session; }
  getLocalUser() { return this.localUser; }
  isConnected() { return this.connected; }
  getOnlineUsers() {
    if (!this.session) return [];
    return [this.localUser, ...this.session.participants.filter(p => p.isOnline)].filter(Boolean) as CollabUser[];
  }

  // Simulate real-time presence updates (demo mode)
  private _simulatePresence() {
    let tick = 0;
    const interval = setInterval(() => {
      if (!this.session) { clearInterval(interval); return; }
      tick++;
      // Simulate Ana moving cursor
      const ana = this.session.participants.find(p => p.id === 'u2');
      if (ana?.cursor) {
        ana.cursor.x = 300 + Math.sin(tick * 0.2) * 80;
        ana.cursor.y = 220 + Math.cos(tick * 0.15) * 60;
        this.emit('cursorMoved', { userId: ana.id, x: ana.cursor.x, y: ana.cursor.y });
      }
      if (tick > 120) clearInterval(interval); // Stop after 120 ticks (~2min)
    }, 1000);
  }
}

export const collaborationService = new CollaborationService();
export default collaborationService;
