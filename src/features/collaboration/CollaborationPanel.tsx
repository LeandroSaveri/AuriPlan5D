// ============================================
// COLLABORATION PANEL
// Responsabilidade: UI de colaboração em tempo real
// Mostra usuários online, cursores, papel, link de convite
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Link, Copy, Check, Lock, Unlock, Clock, X,
  Crown, Eye, Edit3, Trash2, UserPlus, Wifi, WifiOff,
  Share2, Shield,
} from 'lucide-react';
import { collaborationService, type CollabUser, type CollabRole, type CollabSession } from './CollaborationService';

interface CollaborationPanelProps {
  onClose: () => void;
  projectId: string;
}

const ROLE_LABELS: Record<CollabRole, string> = {
  owner: 'Proprietário',
  editor: 'Editor',
  viewer: 'Visualizador',
};

const ROLE_ICONS: Record<CollabRole, typeof Crown> = {
  owner: Crown,
  editor: Edit3,
  viewer: Eye,
};

function UserAvatar({ user, size = 32 }: { user: CollabUser; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 relative"
      style={{ width: size, height: size, background: user.color, fontSize: size * 0.38 }}
    >
      {user.name.charAt(0).toUpperCase()}
      {user.isOnline && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
      )}
    </div>
  );
}

export function CollaborationPanel({ onClose, projectId }: CollaborationPanelProps) {
  const [session, setSession] = useState<CollabSession | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [activeTab, setActiveTab] = useState<'participants' | 'link' | 'settings'>('participants');
  const [inviteEmail, setInviteEmail] = useState('');

  // Start session on mount
  useEffect(() => {
    const s = collaborationService.startSession(projectId, {
      id: 'user-1',
      name: 'Você',
      email: 'user@auriplan.com',
      role: 'owner',
    });
    setSession(s);

    const onUpdate = () => setSession({ ...collaborationService.getSession()! });
    collaborationService.on('sessionUpdated', onUpdate);
    collaborationService.on('userLeft', onUpdate);
    collaborationService.on('userRemoved', onUpdate);
    collaborationService.on('roleChanged', onUpdate);

    return () => {
      collaborationService.removeAllListeners();
    };
  }, [projectId]);

  const copyLink = () => {
    if (!session) return;
    navigator.clipboard.writeText(session.shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const regenerate = () => {
    const link = collaborationService.regenerateShareLink();
    setSession({ ...collaborationService.getSession()! });
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSetPassword = () => {
    collaborationService.setPassword(password);
    setIsLocking(false);
    setShowPasswordInput(false);
    setSession({ ...collaborationService.getSession()! });
  };

  const onlineUsers = collaborationService.getOnlineUsers();
  const allParticipants = session ? [session.owner, ...session.participants] : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Colaboração</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-400">
                  {onlineUsers.length} online
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          {(['participants', 'link', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-white border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'participants' ? 'Participantes' : tab === 'link' ? 'Link' : 'Permissões'}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* PARTICIPANTS TAB */}
          {activeTab === 'participants' && (
            <div className="space-y-4">
              {/* Online presence row */}
              <div className="flex items-center gap-2 mb-3">
                {onlineUsers.slice(0, 5).map(u => (
                  <div key={u.id} title={u.name}>
                    <UserAvatar user={u} size={32} />
                  </div>
                ))}
                {onlineUsers.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 font-medium">
                    +{onlineUsers.length - 5}
                  </div>
                )}
              </div>

              {/* Invite by email */}
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Convidar por e-mail..."
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="flex-1 h-9 px-3 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  onClick={() => { setInviteEmail(''); }}
                  className="px-3 h-9 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Convidar
                </button>
              </div>

              {/* Participants list */}
              <div className="space-y-2">
                {allParticipants.map(user => {
                  const RoleIcon = ROLE_ICONS[user.role];
                  return (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl"
                    >
                      <UserAvatar user={user} size={36} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white truncate">{user.name}</span>
                          {user.id === 'user-1' && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full">Você</span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                          user.role === 'owner' ? 'bg-amber-500/15 text-amber-300'
                          : user.role === 'editor' ? 'bg-indigo-500/15 text-indigo-300'
                          : 'bg-slate-700 text-slate-400'
                        }`}>
                          <RoleIcon className="w-3 h-3" />
                          {ROLE_LABELS[user.role]}
                        </div>
                        {user.id !== 'user-1' && user.role !== 'owner' && (
                          <button
                            onClick={() => collaborationService.removeParticipant(user.id)}
                            className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LINK TAB */}
          {activeTab === 'link' && session && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5" />
                  Link de Compartilhamento
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-slate-300 truncate font-mono bg-slate-900 px-2 py-1.5 rounded-lg">
                    {session.shareLink}
                  </code>
                  <button
                    onClick={copyLink}
                    className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    title="Copiar link"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={regenerate}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Gerar Novo Link
                </button>
                <button
                  onClick={() => setShowPasswordInput(v => !v)}
                  className={`flex-1 py-2 text-sm rounded-xl transition-colors flex items-center justify-center gap-2 ${
                    session.isPasswordProtected
                      ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {session.isPasswordProtected ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  {session.isPasswordProtected ? 'Protegido' : 'Proteger'}
                </button>
              </div>

              {showPasswordInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex gap-2"
                >
                  <input
                    type="password"
                    placeholder="Definir senha..."
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="flex-1 h-9 px-3 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSetPassword}
                    className="px-3 h-9 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium"
                  >
                    Salvar
                  </button>
                </motion.div>
              )}

              <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Link sem expiração · Qualquer pessoa com o link pode {session.isPasswordProtected ? 'entrar com senha' : 'visualizar'}</span>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="space-y-2">
                {[
                  { label: 'Editores podem convidar outros', enabled: true },
                  { label: 'Visualizadores podem exportar', enabled: false },
                  { label: 'Comentários visíveis para todos', enabled: true },
                  { label: 'Histórico de mudanças visível', enabled: true },
                ].map(({ label, enabled }) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{label}</span>
                    </div>
                    <div
                      className={`w-10 h-5 rounded-full transition-colors cursor-pointer flex items-center ${enabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${enabled ? 'translate-x-5' : ''}`} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Wifi className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-300">Modo Demo</span>
                </div>
                <p className="text-xs text-slate-400">
                  A colaboração em tempo real está simulada localmente.
                  Para ativar o WebSocket real, configure <code className="text-indigo-300">VITE_WS_URL</code> no ambiente.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
