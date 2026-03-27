import { useState } from 'react';
import {
  User, Shield, Smartphone, Bell, ChevronRight,
  Loader2, Trash2, Save, X
} from 'lucide-react';
import { useProfile } from '../../users/hooks/useProfile';
import { useDevices } from '../../devices/hooks/useDevices';
import { usePrivacy } from '../../privacy/hooks/usePrivacy';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import { usersApi } from '../../users/api/usersApi';
import type { UpdatePrivacySettingsRequest } from '../../privacy/types';

type SettingsTab = 'profile' | 'privacy' | 'devices' | 'notifications';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const { profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile();
  const { devices, isLoading: devicesLoading, removeDevice } = useDevices();
  const { settings: privacy, isLoading: privacyLoading, updateSettings } = usePrivacy();
  const { notifications, unreadCount, isLoading: notifLoading, markAllRead } = useNotifications();

  // Profile edit state
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [about, setAbout] = useState('');
  const [username, setUsername] = useState('');

  const startEdit = () => {
    if (profile) {
      setDisplayName(profile.displayName);
      setAbout(profile.about ?? '');
      setUsername(profile.username ?? '');
      setEditMode(true);
    }
  };

  const saveProfile = async () => {
    await usersApi.updateProfile({ displayName, about, username });
    setEditMode(false);
    refetchProfile();
  };

  const tabs: { key: SettingsTab; icon: React.ReactNode; label: string }[] = [
    { key: 'profile', icon: <User size={18} />, label: 'Perfil' },
    { key: 'privacy', icon: <Shield size={18} />, label: 'Privacidade' },
    { key: 'devices', icon: <Smartphone size={18} />, label: 'Dispositivos' },
    { key: 'notifications', icon: <Bell size={18} />, label: 'Notificações' },
  ];

  return (
    <div className="flex flex-col h-full bg-black/10 border-r border-white/5">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <h2 className="text-xl font-black text-white uppercase tracking-tight">Configurações</h2>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 pt-4 space-y-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
            <ChevronRight size={14} className="ml-auto opacity-40" />
            {tab.key === 'notifications' && unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {profileLoading ? (
              <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" /></div>
            ) : profile && !editMode ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center py-4">
                  <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center text-2xl font-black text-cyan-400 border border-cyan-500/20 mb-3">
                    {profile.displayName.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-white">{profile.displayName}</h3>
                  {profile.username && <p className="text-cyan-500 text-xs">@{profile.username}</p>}
                  <p className="text-gray-500 text-xs mt-1">{profile.phoneNumber}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Email</span>
                    <p className="text-sm text-gray-300">{profile.email || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Sobre</span>
                    <p className="text-sm text-gray-300">{profile.about || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Status</span>
                    <p className="text-sm text-gray-300">{profile.isOnline ? '🟢 Online' : '⚫ Offline'}</p>
                  </div>
                </div>
                <button onClick={startEdit} className="w-full py-3 bg-cyan-500/10 text-cyan-400 rounded-xl font-bold text-xs uppercase hover:bg-cyan-500/20 transition-all border border-cyan-500/20">
                  Editar Perfil
                </button>
              </div>
            ) : profile && editMode ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Nome</label>
                    <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/30" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Username</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/30" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Sobre</label>
                    <textarea value={about} onChange={e => setAbout(e.target.value)} maxLength={139} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/30 h-20 resize-none" />
                    <span className="text-[10px] text-gray-600">{about.length}/139</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveProfile} className="flex-1 py-3 bg-cyan-500 text-black rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2">
                    <Save size={14} /> Salvar
                  </button>
                  <button onClick={() => setEditMode(false)} className="px-4 py-3 bg-white/5 text-gray-400 rounded-xl text-xs">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* PRIVACY */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            {privacyLoading ? (
              <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" /></div>
            ) : privacy ? (
              <div className="space-y-3">
                {[
                  { label: 'Visto por último', key: 'lastSeenVisible' as const, value: privacy.lastSeenVisible },
                  { label: 'Foto de perfil', key: 'profilePhoto' as const, value: privacy.profilePhoto },
                  { label: 'Sobre', key: 'aboutVisible' as const, value: privacy.aboutVisible },
                  { label: 'Status', key: 'statusVisible' as const, value: privacy.statusVisible },
                  { label: 'Grupos', key: 'groupsAdd' as const, value: privacy.groupsAdd },
                ].map(item => (
                  <div key={item.key} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{item.value}</p>
                    </div>
                    <select
                      value={item.value}
                      onChange={e => {
                        const updated: UpdatePrivacySettingsRequest = { ...privacy, [item.key]: e.target.value };
                        updateSettings(updated);
                      }}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Everyone">Todos</option>
                      <option value="Contacts">Contatos</option>
                      <option value="Nobody">Ninguém</option>
                    </select>
                  </div>
                ))}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-white">Confirmação de Leitura</p>
                    <p className="text-[10px] text-gray-500">Tiques azuis</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ ...privacy, readReceipts: !privacy.readReceipts })}
                    className={`w-12 h-6 rounded-full transition-all ${privacy.readReceipts ? 'bg-cyan-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${privacy.readReceipts ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* DEVICES */}
        {activeTab === 'devices' && (
          <div className="space-y-3">
            {devicesLoading ? (
              <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" /></div>
            ) : devices.length === 0 ? (
              <p className="text-center text-gray-500 text-sm mt-8">Nenhum dispositivo registrado</p>
            ) : (
              devices.map(device => (
                <div key={device.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                  <Smartphone size={20} className="text-cyan-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{device.deviceName || device.deviceType}</p>
                    <p className="text-[10px] text-gray-500">{device.platform} • Ativo: {new Date(device.lastActive).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => removeDevice(device.id)} className="p-2 text-red-500/60 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-3">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="w-full py-2 text-cyan-400 text-xs font-bold uppercase hover:bg-cyan-500/10 rounded-xl transition-all">
                Marcar todas como lidas
              </button>
            )}
            {notifLoading ? (
              <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" /></div>
            ) : notifications.length === 0 ? (
              <p className="text-center text-gray-500 text-sm mt-8">Nenhuma notificação</p>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className={`p-4 rounded-xl border transition-all ${notif.isRead ? 'bg-white/[0.02] border-white/5' : 'bg-cyan-500/5 border-cyan-500/10'}`}>
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                    <span className="text-[9px] text-gray-600">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{notif.body}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
