import { useRef, useState, useCallback, type ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChatFeed } from '../hooks/useChatFeed';
import { useMessages } from '../hooks/useMessages';
import { useChatHub } from '../hooks/useChatHub';
import {
  useSendMessageSaga,
  useDeleteMessageSaga,
  useCreateChatSaga,
  useJoinGroupSaga,
} from '@/sagas';
import { mediaApi } from '@/features/media/api/mediaApi';
import {
  LogOut, MessageSquare, Users, Settings, Search,
  Send, Paperclip, ShieldCheck, Loader2, UserPlus,
  User as UserIcon, Trash2, Link, X, Wifi, WifiOff,
  Image, FileText, Mic, Video,
} from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { LanguageSelector } from '../../../components/ui/LanguageSelector';
import { AddContactModal, ContactList } from '../../contacts';
import { useChatStore } from '../../../store/useChatStore';
import { toast } from 'react-toastify';
import type { AnyMessage, OptimisticMessage, ChatDto } from '../types';

export const ChatShell = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const { chats, isLoading: feedLoading, refetch: refetchFeed } = useChatFeed();
  const selectedContact = useChatStore(s => s.selectedContact);
  const setSelectedContact = useChatStore(s => s.setSelectedContact);
  const activeChat = useChatStore(s => s.activeChat);
  const setActiveChat = useChatStore(s => s.setActiveChat);
  const isHubConnected = useChatStore(s => s.isHubConnected);

  const currentChatId: number | undefined =
    (activeChat as any)?.chatId ?? (activeChat as any)?.id ?? undefined;

  const { messages, isLoading: messagesLoading, refetch: refetchMessages } =
    useMessages(currentChatId);

  useChatHub();

  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isJoinGroupOpen, setIsJoinGroupOpen] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [joinToken, setJoinToken] = useState('');
  const [view, setView] = useState<'chats' | 'contacts'>('chats');
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addOptimisticMessage = useChatStore(s => s.addOptimisticMessage);
  const confirmOptimisticMessage = useChatStore(s => s.confirmOptimisticMessage);
  const removeOptimisticMessage = useChatStore(s => s.removeOptimisticMessage);
  const markMessageDeleted = useChatStore(s => s.markMessageDeleted);
  const restoreMessage = useChatStore(s => s.restoreMessage);

  const sendMessageSaga = useSendMessageSaga({
    chatId: currentChatId ?? 0,
    senderId: user?.userId ?? 0,
    onOptimisticAdd: (msg: OptimisticMessage) => {
      if (currentChatId) addOptimisticMessage(msg);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    },
    onConfirm: (tempId, realMsg) => {
      if (currentChatId) confirmOptimisticMessage(currentChatId, tempId, realMsg);
    },
    onCompensate: (tempId) => {
      if (currentChatId) {
        removeOptimisticMessage(currentChatId, tempId);
        toast.error('Falha ao enviar mensagem. Saga compensada.');
      }
    },
    onRefreshFeed: async () => {
      await refetchFeed();
      await refetchMessages();
    },
  });

  const deleteMessageSaga = useDeleteMessageSaga({
    onMarkDeleted: (msgId) => {
      if (currentChatId) markMessageDeleted(currentChatId, msgId);
    },
    onRestore: (msgId) => {
      if (currentChatId) {
        restoreMessage(currentChatId, msgId);
        toast.error('Não foi possível apagar a mensagem. Ação revertida.');
      }
    },
  });

  const createChatSaga = useCreateChatSaga({
    onRefreshFeed: refetchFeed,
    onChatCreated: (chat: ChatDto) => {
      setActiveChat(chat);
      setSelectedContact(null);
      setView('chats');
    },
  });

  const joinGroupSaga = useJoinGroupSaga({ onRefreshFeed: refetchFeed });

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || !currentChatId || sendMessageSaga.isRunning) return;
    const content = input;
    setInput('');
    await sendMessageSaga.execute(content);
  }, [input, currentChatId, sendMessageSaga]);

  const handleDeleteMessage = useCallback(async (msg: AnyMessage) => {
    if (!currentChatId || deleteMessageSaga.isRunning) return;
    if (!window.confirm('Apagar esta mensagem para todos?')) return;
    const ok = await deleteMessageSaga.execute(currentChatId, msg.id, msg.sentAt);
    if (!ok && deleteMessageSaga.error) toast.error(deleteMessageSaga.error);
  }, [currentChatId, deleteMessageSaga]);

  const handleHandshake = useCallback(async () => {
    if (!selectedContact || !input.trim() || createChatSaga.isRunning) return;
    const content = input;
    setInput('');
    const result = await createChatSaga.execute(
      selectedContact.contactUserId,
      selectedContact.displayName,
      content
    );
    if (!result && createChatSaga.error) toast.error(createChatSaga.error);
  }, [selectedContact, input, createChatSaga]);

  const handleJoinGroup = useCallback(async () => {
    if (!joinToken.trim() || joinGroupSaga.isRunning) return;
    const ok = await joinGroupSaga.execute(joinToken);
    if (ok) {
      toast.success('Você entrou no grupo!');
      setJoinToken('');
      setIsJoinGroupOpen(false);
    } else {
      toast.error(joinGroupSaga.error ?? 'Não foi possível entrar no grupo.');
    }
  }, [joinToken, joinGroupSaga]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!currentChatId) return;
    setUploadingMedia(true);
    try {
      const { url, messageType } = await mediaApi.uploadAuto(file, currentChatId);
      await sendMessageSaga.execute(url, messageType);
      toast.success('Arquivo enviado!');
    } catch {
      toast.error('Erro ao enviar arquivo.');
    } finally {
      setUploadingMedia(false);
    }
  }, [currentChatId, sendMessageSaga]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = '';
  };

  /** Abre o file input com o filtro correto para cada tipo de anexo */
  const handleAttachSelect = useCallback((accept: string) => {
    setShowAttachMenu(false);
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  }, []);

  const isSending = sendMessageSaga.isRunning || uploadingMedia;
  const filteredChats = chats.filter(c =>
    (c.chatName ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans">
      <input ref={fileInputRef} type="file" className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
        onChange={handleFileChange} />

      {isAddContactOpen && <AddContactModal onClose={() => setIsAddContactOpen(false)} />}

      {isJoinGroupOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-white/5 p-8 rounded-[2rem] w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-cyan-400">
                  <Link size={20} />
                </div>
                <h2 className="text-xl font-black text-white">Entrar via Link</h2>
              </div>
              <button onClick={() => setIsJoinGroupOpen(false)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest ml-1 block">Token de Convite</label>
              <input type="text" value={joinToken} onChange={e => setJoinToken(e.target.value)}
                placeholder="Cole o token aqui..."
                className="w-full p-4 bg-[#1a1a1a] border border-transparent focus:border-cyan-500/40 text-gray-200 rounded-2xl outline-none text-sm" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setIsJoinGroupOpen(false)} className="flex-1 py-4 text-[11px] font-bold text-gray-500 hover:text-white uppercase tracking-widest">Cancelar</button>
                <button onClick={handleJoinGroup} disabled={joinGroupSaga.isRunning || !joinToken.trim()}
                  className="flex-1 py-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                  {joinGroupSaga.isRunning ? <><Loader2 className="animate-spin" size={16} /> SAGA...</> : 'Entrar no Grupo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-20 flex flex-col items-center py-6 bg-black/40 border-r border-white/5 space-y-8">
        <button onClick={() => { setView('chats'); setSelectedContact(null); setActiveChat(null); }}
          className={`p-3 rounded-2xl border cursor-pointer transition-all ${view === 'chats' ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'border-transparent text-gray-600 hover:text-white'}`}>
          <MessageSquare size={24} />
        </button>
        <button onClick={() => setView('contacts')}
          className={`p-3 rounded-2xl border cursor-pointer transition-all ${view === 'contacts' ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 'border-transparent text-gray-600 hover:text-white'}`}>
          <Users size={24} />
        </button>
        <button onClick={() => setIsJoinGroupOpen(true)}
          className="p-3 rounded-2xl border border-transparent text-gray-600 hover:text-cyan-400 cursor-pointer transition-all" title="Entrar em grupo">
          <Link size={24} />
        </button>
        <Settings className="text-gray-600 hover:text-white cursor-pointer transition-colors" size={24} />
        <div className="mt-auto flex flex-col items-center space-y-4">
          <div title={isHubConnected ? 'Conectado' : 'Offline'}>
            {isHubConnected ? <Wifi size={18} className="text-cyan-500/60" /> : <WifiOff size={18} className="text-gray-600" />}
          </div>
          <LanguageSelector variant="accordion" />
          <button onClick={logout} className="p-3 text-gray-600 hover:text-red-500 transition-colors"><LogOut size={24} /></button>
        </div>
      </aside>

      {/* Lista de Chats / Contatos */}
      <section className="w-80 md:w-96 bg-black/10 border-r border-white/5 flex flex-col">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-black uppercase tracking-tighter ${view === 'contacts' ? 'text-purple-500' : 'text-white'}`}>
              {view === 'chats' ? 'Philo' : t('contacts.title')}
            </h2>
            <button onClick={() => setIsAddContactOpen(true)}
              className="p-2 bg-white/5 hover:bg-cyan-500/10 border border-white/10 rounded-xl text-cyan-500 transition-all active:scale-90">
              <UserPlus size={18} />
            </button>
          </div>
          <div className="relative flex items-center bg-white/5 rounded-2xl px-4 py-3 border border-transparent focus-within:border-cyan-500/30 transition-all">
            <Search className="text-gray-500" size={18} />
            <input type="text" className="bg-transparent ml-3 text-sm w-full outline-none"
              placeholder={t('chat.search_placeholder')} value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-2">
          {view === 'chats' ? (
            feedLoading
              ? <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" /></div>
              : filteredChats.map(chat => {
                const isActive = currentChatId === chat.chatId;
                const time = chat.lastMessageSentAt
                  ? new Date(chat.lastMessageSentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';
                return (
                  <button key={chat.chatId} onClick={() => setActiveChat(chat)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer group ${isActive ? 'bg-white/[0.08] border-white/10' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}`}>
                    <div className="flex justify-between items-center">
                      <h4 className={`font-bold text-sm truncate transition-colors ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`}>
                        {chat.chatName ?? 'Chat'}
                      </h4>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {chat.unreadCount > 0 && (
                          <span className="bg-cyan-500 text-black text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                            {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-600">{time}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{chat.lastMessageContent ?? '...'}</p>
                  </button>
                );
              })
          ) : (
            <ContactList />
          )}
        </div>
      </section>

      {/* Área de Mensagens */}
      <main className="flex-1 flex flex-col bg-[#080808] relative">
        {activeChat ? (
          <ChatView
            chatName={(activeChat as any).chatName ?? (activeChat as any).name ?? 'Chat'}
            chatAvatarUrl={(activeChat as any).avatarUrl}
            messages={messages}
            messagesLoading={messagesLoading}
            messagesEndRef={messagesEndRef}
            currentUserId={user?.userId ?? 0}
            input={input}
            isSending={isSending}
            uploadingMedia={uploadingMedia}
            showAttachMenu={showAttachMenu}
            onToggleAttachMenu={() => setShowAttachMenu(prev => !prev)}
            onAttachSelect={handleAttachSelect}
            onInputChange={setInput}
            onSend={handleSendMessage}
            onDelete={handleDeleteMessage}
          />
        ) : selectedContact ? (
          <HandshakeView
            displayName={selectedContact.displayName}
            phoneNumber={selectedContact.phoneNumber}
            avatarUrl={selectedContact.avatarUrl}
            input={input}
            isSending={createChatSaga.isRunning}
            currentStep={createChatSaga.currentStep?.toString() ?? null}
            onInputChange={setInput}
            onHandshake={handleHandshake}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="opacity-10 mb-8"><UserIcon size={120} strokeWidth={1} /></div>
            <div className="max-w-md bg-white/5 p-6 rounded-2xl border border-white/10 text-sm text-gray-400">
              <Trans i18nKey="chat.welcome_message" values={{ name: user?.displayName }}
                components={{ bold: <span className="text-cyan-400 font-bold" /> }} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────────────────────────────────────────

/** Opções do menu de anexo estilo WhatsApp */
const ATTACH_OPTIONS = [
  {
    label: 'Documento',
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar',
    icon: FileText,
    color: 'bg-blue-600/80',
    border: 'border-blue-500/40',
    text: 'text-blue-200',
  },
  {
    label: 'Imagem',
    accept: 'image/*',
    icon: Image,
    color: 'bg-emerald-600/80',
    border: 'border-emerald-500/40',
    text: 'text-emerald-200',
  },
  {
    label: 'Áudio',
    accept: 'audio/*',
    icon: Mic,
    color: 'bg-amber-600/80',
    border: 'border-amber-500/40',
    text: 'text-amber-200',
  },
  {
    label: 'Vídeo',
    accept: 'video/*',
    icon: Video,
    color: 'bg-rose-600/80',
    border: 'border-rose-500/40',
    text: 'text-rose-200',
  },
] as const;

interface ChatViewProps {
  chatName: string;
  chatAvatarUrl?: string;
  messages: AnyMessage[];
  messagesLoading: boolean;
  messagesEndRef: { current: HTMLDivElement | null };
  currentUserId: number;
  input: string;
  isSending: boolean;
  uploadingMedia: boolean;
  showAttachMenu: boolean;
  onToggleAttachMenu: () => void;
  onAttachSelect: (accept: string) => void;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onDelete: (msg: AnyMessage) => void;
}

const ChatView = ({
  chatName, chatAvatarUrl, messages, messagesLoading, messagesEndRef,
  currentUserId, input, isSending, uploadingMedia,
  showAttachMenu, onToggleAttachMenu, onAttachSelect,
  onInputChange, onSend, onDelete,
}: ChatViewProps) => {
  const [hoveredMsgId, setHoveredMsgId] = useState<number | null>(null);

  const getMediaIcon = (type: string) => {
    if (type === 'Image') return <Image size={12} />;
    if (type === 'Video') return <Video size={12} />;
    if (type === 'Audio') return <Mic size={12} />;
    if (type === 'Document') return <FileText size={12} />;
    return null;
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center font-bold text-cyan-400 border border-cyan-500/20 overflow-hidden shrink-0">
            {chatAvatarUrl
              ? <img src={chatAvatarUrl} alt={chatName} className="w-full h-full object-cover" />
              : <span>{chatName.substring(0, 2).toUpperCase()}</span>}
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">{chatName}</h3>
            <p className="text-[10px] text-cyan-500 font-bold uppercase animate-pulse">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-cyan-500/60 text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck size={16} className="text-cyan-500" /> E2E Cifrado
        </div>
      </header>

      {/* Mensagens */}
      <div className="flex-1 p-8 overflow-y-auto flex flex-col space-y-4">
        {messagesLoading ? (
          <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" size={32} /></div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600 text-[10px] uppercase py-2 px-4 bg-white/5 rounded-full">
              Início da conversa criptografada
            </p>
          </div>
        ) : (
          messages.map(msg => {
            const isMine = String(msg.senderId) === String(currentUserId);
            const isPending = (msg as any).isPending;
            const isOptimistic = (msg as any).isOptimistic;
            const isDeleted = msg.deletedForEveryone;
            const mediaIcon = getMediaIcon(msg.type);

            return (
              <div key={msg.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'} group`}
                onMouseEnter={() => setHoveredMsgId(msg.id)}
                onMouseLeave={() => setHoveredMsgId(null)}>
                <div className="relative max-w-[70%]">
                  {isMine && !isDeleted && !isOptimistic && hoveredMsgId === msg.id && (
                    <button onClick={() => onDelete(msg)}
                      className="absolute -top-2 -left-8 p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-all z-10"
                      title="Apagar para todos">
                      <Trash2 size={12} />
                    </button>
                  )}
                  <div className={`p-3 rounded-2xl text-sm transition-all ${
                    isDeleted ? 'bg-white/[0.03] border border-white/5 italic opacity-40'
                      : isMine
                        ? `bg-cyan-500/20 border border-cyan-500/30 rounded-tr-none text-cyan-50 shadow-[0_5px_15px_rgba(6,182,212,0.1)] ${isPending ? 'opacity-70' : ''}`
                        : 'bg-white/5 border border-white/10 rounded-tl-none text-gray-200'
                  }`}>
                    {isDeleted ? (
                      <p className="text-[11px]">🚫 Mensagem apagada</p>
                    ) : (
                      <>
                        {mediaIcon && (
                          <div className="flex items-center gap-1 mb-1 text-[10px] opacity-60">
                            {mediaIcon}
                            <span className="uppercase tracking-wider">{msg.type}</span>
                          </div>
                        )}
                        {msg.content && (
                          (msg.type === 'Image' || msg.type === 'Video')
                            ? <img src={msg.content} alt="mídia" className="max-w-full rounded-lg mb-1" />
                            : <p className="break-words">{msg.content}</p>
                        )}
                      </>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[9px] opacity-40">
                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isPending && <Loader2 size={9} className="animate-spin opacity-40" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <footer className="p-6 bg-black/40 border-t border-white/5 shrink-0">
        <div className="max-w-4xl mx-auto relative">

          {/* ── Menu de Anexo estilo WhatsApp ──────────────────────────── */}
          {showAttachMenu && (
            <div className="absolute bottom-full mb-3 left-0 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/60">
                <div className="grid grid-cols-4 gap-3">
                  {ATTACH_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => onAttachSelect(opt.accept)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${opt.border} ${opt.color} hover:opacity-90 active:scale-95 transition-all w-20`}
                      >
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <Icon size={20} className={opt.text} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${opt.text}`}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Seta apontando para baixo */}
              <div className="w-3 h-3 bg-[#111] border-r border-b border-white/10 rotate-45 ml-5 -mt-1.5" />
            </div>
          )}

          {/* ── Barra de Input ─────────────────────────────────────────── */}
          <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-2 border border-white/10 focus-within:border-cyan-500/30 transition-all">
            <button
              className={`p-3 transition-colors relative ${showAttachMenu ? 'text-cyan-400' : 'text-gray-500 hover:text-cyan-400'}`}
              onClick={onToggleAttachMenu}
              disabled={uploadingMedia}
              title="Anexar arquivo"
            >
              {uploadingMedia
                ? <Loader2 size={20} className="animate-spin text-cyan-400" />
                : <Paperclip size={20} className={showAttachMenu ? 'rotate-45 transition-transform duration-200' : 'transition-transform duration-200'} />
              }
            </button>
            <input
              className="flex-1 bg-transparent outline-none text-sm p-2 text-gray-200 placeholder:text-gray-600"
              placeholder="Mensagem criptografada..."
              value={input}
              onChange={e => onInputChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
              disabled={isSending}
              onClick={() => { if (showAttachMenu) onToggleAttachMenu(); }}
            />
            <button
              onClick={onSend}
              disabled={isSending || !input.trim()}
              className="p-3 bg-cyan-500 text-black rounded-xl hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-95 disabled:opacity-50"
            >
              {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const HandshakeView = ({
  displayName, phoneNumber, avatarUrl, input, isSending, currentStep, onInputChange, onHandshake,
}: {
  displayName: string; phoneNumber?: string; avatarUrl?: string;
  input: string; isSending: boolean; currentStep: string | null;
  onInputChange: (v: string) => void; onHandshake: () => void;
}) => (
  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-300">
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-black p-[2px] mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
      <div className="w-full h-full rounded-full bg-[#080808] flex items-center justify-center overflow-hidden">
        {avatarUrl
          ? <img src={avatarUrl} className="w-full h-full object-cover" alt={displayName} />
          : <span className="text-2xl font-black text-purple-500">{displayName.substring(0, 2).toUpperCase()}</span>}
      </div>
    </div>
    <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">{displayName}</h3>
    <p className="text-purple-500/60 font-mono text-[10px] mb-8 tracking-[0.2em]">{phoneNumber ?? 'Identidade Oculta'}</p>
    <div className="w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-4 text-left">
      <label className="text-[9px] font-black text-purple-500 uppercase mb-2 block tracking-widest opacity-70">Mensagem de Iniciação</label>
      <textarea className="w-full bg-transparent outline-none text-sm text-gray-300 resize-none h-20"
        placeholder="Escreva algo para iniciar o handshake..."
        value={input} disabled={isSending} onChange={e => onInputChange(e.target.value)} />
    </div>
    {isSending && currentStep && (
      <p className="text-[9px] text-purple-400/60 font-mono mb-3 animate-pulse">SAGA: {currentStep}...</p>
    )}
    <button onClick={onHandshake} disabled={!input.trim() || isSending}
      className="w-full max-w-sm bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 transition-all">
      {isSending ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
      {isSending ? 'Processando Saga...' : 'Estabelecer Handshake'}
    </button>
  </div>
);
