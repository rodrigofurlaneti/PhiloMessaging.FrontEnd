import { useRef, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChatFeed } from '../hooks/useChatFeed';
import { useMessages } from '../hooks/useMessages';
import {
    LogOut, MessageSquare, Users, Settings, Search,
    Send, Paperclip, ShieldCheck, Loader2, UserPlus,
    Mic, MoreVertical
} from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { LanguageSelector } from '../../../components/ui/LanguageSelector';
import { AddContactModal, ContactList } from '../../contacts';
import { useChatStore } from '../../../store/useChatStore';
import { chatApi } from '../api/chatApi';

/* ─── Avatar helper ─────────────────────────────────────────────────── */
const Avatar = ({ name, size = 40, active = false }: { name: string; size?: number; active?: boolean }) => {
    const initials = name.substring(0, 2).toUpperCase();
    return (
        <div
            style={{
                width: size, height: size,
                borderRadius: '50%',
                background: active ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.12)'}`,
                boxShadow: active ? '0 0 12px rgba(201,168,76,0.12)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                fontSize: size > 32 ? 13 : 11,
                fontFamily: 'DM Mono, monospace',
                fontWeight: 500,
                color: active ? '#C9A84C' : 'rgba(201,168,76,0.5)',
                transition: 'all 0.25s ease',
            }}
        >
            {initials}
        </div>
    );
};

/* ─── Sidebar nav icon ──────────────────────────────────────────────── */
const NavIcon = ({ icon, active, onClick, label }: { icon: React.ReactNode; active?: boolean; onClick: () => void; label?: string }) => (
    <button
        onClick={onClick}
        title={label}
        style={{
            position: 'relative',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44,
            borderRadius: 14,
            background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
            border: `1px solid ${active ? 'rgba(201,168,76,0.28)' : 'transparent'}`,
            color: active ? '#C9A84C' : 'rgba(201,168,76,0.25)',
            cursor: 'pointer',
            transition: 'all 0.22s ease',
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.color = 'rgba(201,168,76,0.6)'; } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(201,168,76,0.25)'; } }}
    >
        {icon}
        {active && (
            <span style={{
                position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                width: 16, height: 2, borderRadius: 1,
                background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            }}/>
        )}
    </button>
);

/* ─── Chat timestamp helper ─────────────────────────────────────────── */
const formatTime = (d: string | Date) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/* ─── Main component ────────────────────────────────────────────────── */
export const ChatShell = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { chats, isLoading, refetch } = useChatFeed();
    const { selectedContact, setSelectedContact, activeChat, setActiveChat } = useChatStore();
    const currentChatId = (activeChat as any)?.chatId || (activeChat as any)?.id;
    const { messages, isLoading: messagesLoading, refetch: refetchMessages } = useMessages(currentChatId);

    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [view, setView] = useState<'chats' | 'contacts'>('chats');
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Auto-scroll to newest message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || !currentChatId || isSending) return;
        setIsSending(true);
        try {
            await chatApi.sendMessageText(currentChatId, input);
            setInput('');
            if (refetchMessages) await refetchMessages();
            if (refetch) refetch();
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleStartHandshake = async () => {
        if (!selectedContact || !input.trim() || isSending) return;
        setIsSending(true);
        try {
            const newChat = await chatApi.createChat({
                type: 1,
                name: selectedContact.displayName,
                initialMemberIds: [selectedContact.contactUserId]
            });
            const chatId = (newChat as any).id || (newChat as any).chatId;
            if (chatId) {
                await chatApi.sendMessageText(chatId, input);
                if (refetch) await refetch();
                setInput('');
                setSelectedContact(null);
                setActiveChat(newChat);
                setView('chats');
            }
        } catch (error) {
            console.error("Erro no Handshake:", error);
        } finally {
            setIsSending(false);
        }
    };

    const filteredChats = chats.filter(c =>
        !searchQuery || c.chatName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            className="flex h-screen w-screen overflow-hidden"
            style={{ background: '#080808', fontFamily: 'Outfit, sans-serif', color: '#F5EDD8' }}
        >
            {isAddContactOpen && <AddContactModal onClose={() => setIsAddContactOpen(false)} />}

            {/* ── Slim Sidebar ─────────────────────────────────────────────── */}
            <aside
                style={{
                    width: 68,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '20px 0',
                    background: '#090909',
                    borderRight: '1px solid rgba(201,168,76,0.07)',
                    gap: 8,
                }}
            >
                {/* User avatar */}
                <div style={{ marginBottom: 16, cursor: 'default' }}>
                    <Avatar name={user?.displayName ?? 'US'} size={38} active />
                </div>

                {/* Hairline */}
                <div style={{ width: 28, height: 1, background: 'rgba(201,168,76,0.08)', marginBottom: 8 }}/>

                <NavIcon
                    icon={<MessageSquare size={18}/>}
                    active={view === 'chats'}
                    onClick={() => { setView('chats'); setSelectedContact(null); setActiveChat(null); }}
                    label="Conversas"
                />
                <NavIcon
                    icon={<Users size={18}/>}
                    active={view === 'contacts'}
                    onClick={() => setView('contacts')}
                    label="Contatos"
                />
                <NavIcon
                    icon={<Settings size={18}/>}
                    active={false}
                    onClick={() => {}}
                    label="Configurações"
                />

                {/* Spacer */}
                <div style={{ flex: 1 }}/>

                <div style={{ width: 28, height: 1, background: 'rgba(201,168,76,0.08)', marginBottom: 8 }}/>
                <div style={{ marginBottom: 4 }}>
                    <LanguageSelector variant="accordion" />
                </div>
                <NavIcon
                    icon={<LogOut size={17}/>}
                    active={false}
                    onClick={logout}
                    label="Sair"
                />
            </aside>

            {/* ── Master Column ─────────────────────────────────────────────── */}
            <section
                style={{
                    width: 300,
                    display: 'flex', flexDirection: 'column',
                    background: '#0b0b0b',
                    borderRight: '1px solid rgba(201,168,76,0.07)',
                    flexShrink: 0,
                }}
            >
                {/* Header */}
                <div style={{ padding: '22px 18px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h2
                            className="font-cormorant"
                            style={{
                                fontSize: 28,
                                fontWeight: 300,
                                letterSpacing: '0.05em',
                                color: view === 'chats' ? '#F5EDD8' : '#C9A84C',
                                transition: 'color 0.25s',
                            }}
                        >
                            {view === 'chats' ? 'Philo' : t('contacts.title')}
                        </h2>
                        <button
                            onClick={() => setIsAddContactOpen(true)}
                            style={{
                                width: 34, height: 34, borderRadius: 10, cursor: 'pointer',
                                background: 'rgba(201,168,76,0.07)',
                                border: '1px solid rgba(201,168,76,0.12)',
                                color: '#C9A84C',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.13)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.07)'; }}
                        >
                            <UserPlus size={15}/>
                        </button>
                    </div>

                    {/* Search */}
                    <div
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            background: '#141414', borderRadius: 12,
                            border: '1px solid rgba(201,168,76,0.07)',
                            padding: '10px 14px',
                            transition: 'border-color 0.2s',
                        }}
                        onFocusCapture={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)')}
                        onBlurCapture={e  => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.07)')}
                    >
                        <Search size={14} style={{ color: 'rgba(201,168,76,0.3)', flexShrink: 0 }}/>
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={t('chat.search_placeholder')}
                            className="bg-transparent outline-none w-full"
                            style={{ fontSize: 13, color: '#F5EDD8', fontFamily: 'DM Mono, monospace' }}
                        />
                    </div>
                </div>

                {/* Hairline */}
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.08), transparent)', margin: '0 18px 8px' }}/>

                {/* List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '4px 10px' }}>
                    {view === 'chats' ? (
                        isLoading
                            ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10 }}>
                                    <Loader2 size={20} className="animate-spin" style={{ color: '#C9A84C' }}/>
                                    <span className="font-mono-dm" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.3)' }}>
                                        Carregando
                                    </span>
                                </div>
                            )
                            : filteredChats.length === 0
                            ? (
                                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                    <MessageSquare size={32} style={{ color: 'rgba(201,168,76,0.1)', margin: '0 auto 12px' }}/>
                                    <p className="font-mono-dm" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.25)' }}>
                                        Nenhuma conversa
                                    </p>
                                </div>
                            )
                            : filteredChats.map((chat, i) => {
                                const isActive = currentChatId === chat.chatId;
                                return (
                                    <div
                                        key={chat.chatId}
                                        onClick={() => setActiveChat(chat)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '10px 12px', borderRadius: 14, marginBottom: 2,
                                            cursor: 'pointer',
                                            background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                                            border: `1px solid ${isActive ? 'rgba(201,168,76,0.2)' : 'transparent'}`,
                                            borderLeft: `3px solid ${isActive ? '#C9A84C' : 'transparent'}`,
                                            transition: 'all 0.2s ease',
                                            animationDelay: `${i * 0.04}s`,
                                        }}
                                        className="animate-slide-r"
                                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(201,168,76,0.04)'; } }}
                                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; } }}
                                    >
                                        <Avatar name={chat.chatName ?? 'CH'} size={40} active={isActive}/>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                                                <span style={{
                                                    fontSize: 13, fontWeight: 600,
                                                    color: isActive ? '#E8D5A3' : '#d4cbbf',
                                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                    maxWidth: 130,
                                                }}>
                                                    {chat.chatName}
                                                </span>
                                                <span className="font-mono-dm" style={{ fontSize: 9, color: 'rgba(201,168,76,0.3)', letterSpacing: '0.06em', flexShrink: 0 }}>
                                                    {chat.lastMessageSentAt ? formatTime(chat.lastMessageSentAt) : ''}
                                                </span>
                                            </div>
                                            <p style={{
                                                fontSize: 11, fontFamily: 'DM Mono, monospace',
                                                color: isActive ? 'rgba(201,168,76,0.45)' : 'rgba(255,255,255,0.2)',
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                letterSpacing: '0.02em',
                                            }}>
                                                {chat.lastMessageContent || '···'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <ContactList />
                    )}
                </div>
            </section>

            {/* ── Detail Column ─────────────────────────────────────────────── */}
            <main
                className="chat-bg"
                style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
            >
                {activeChat ? (
                    (() => {
                        const chatData = activeChat as any;
                        const name = chatData.chatName || chatData.name || 'Chat';
                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} className="animate-fade-in">

                                {/* ── Chat Header ── */}
                                <header
                                    style={{
                                        height: 64,
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '0 28px',
                                        background: 'rgba(8,8,8,0.9)',
                                        backdropFilter: 'blur(20px)',
                                        borderBottom: '1px solid rgba(201,168,76,0.07)',
                                        flexShrink: 0,
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <Avatar name={name} size={38} active />
                                        <div>
                                            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#F5EDD8', marginBottom: 2 }}>
                                                {name}
                                            </h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }}/>
                                                <span className="font-mono-dm" style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)' }}>
                                                    Online
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <ShieldCheck size={13} style={{ color: 'rgba(201,168,76,0.4)' }}/>
                                            <span className="font-mono-dm" style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.35)' }}>
                                                {t('chat.encrypted_tag')}
                                            </span>
                                        </div>
                                        <button style={{ color: 'rgba(201,168,76,0.25)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.6)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.25)')}
                                        >
                                            <MoreVertical size={18}/>
                                        </button>
                                    </div>
                                </header>

                                {/* ── Messages ── */}
                                <div
                                    style={{
                                        flex: 1, padding: '24px 32px',
                                        overflowY: 'auto',
                                        display: 'flex', flexDirection: 'column', gap: 6,
                                    }}
                                >
                                    {messagesLoading ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                            <Loader2 size={22} className="animate-spin" style={{ color: '#C9A84C' }}/>
                                        </div>
                                    ) : messages.length > 0 ? (
                                        messages.map((msg: any, i: number) => {
                                            const isMine = String(msg.senderId) === String(user?.id);
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={isMine ? 'animate-msg-mine' : 'animate-msg-their'}
                                                    style={{
                                                        maxWidth: '68%',
                                                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                                                        animationDelay: `${Math.min(i * 0.03, 0.3)}s`,
                                                    }}
                                                >
                                                    <div
                                                        className={isMine ? 'msg-mine' : 'msg-theirs'}
                                                        style={{
                                                            padding: '10px 15px',
                                                            borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                                            fontSize: 13.5,
                                                            lineHeight: 1.55,
                                                            wordBreak: 'break-word',
                                                        }}
                                                    >
                                                        <p style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{msg.content}</p>
                                                        <span
                                                            className="font-mono-dm"
                                                            style={{
                                                                display: 'block', textAlign: 'right',
                                                                fontSize: 9, marginTop: 5,
                                                                color: isMine ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.2)',
                                                                letterSpacing: '0.06em',
                                                            }}
                                                        >
                                                            {formatTime(msg.sentAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <div
                                                style={{
                                                    padding: '10px 24px', borderRadius: 100,
                                                    background: 'rgba(201,168,76,0.05)',
                                                    border: '1px solid rgba(201,168,76,0.1)',
                                                }}
                                            >
                                                <span className="font-mono-dm" style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.3)' }}>
                                                    Início da conversa criptografada
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef}/>
                                </div>

                                {/* ── Input Bar ── */}
                                <footer
                                    style={{
                                        padding: '16px 28px 20px',
                                        background: 'rgba(8,8,8,0.95)',
                                        backdropFilter: 'blur(24px)',
                                        borderTop: '1px solid rgba(201,168,76,0.07)',
                                        flexShrink: 0,
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: 840, margin: '0 auto',
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            background: '#111',
                                            border: '1px solid rgba(201,168,76,0.1)',
                                            borderRadius: 18,
                                            padding: '6px 8px 6px 16px',
                                            transition: 'border-color 0.25s, box-shadow 0.25s',
                                        }}
                                        onFocusCapture={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.04)'; }}
                                        onBlurCapture={e  => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <button
                                            style={{ color: 'rgba(201,168,76,0.25)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, lineHeight: 0, padding: 4 }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.6)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.25)')}
                                        >
                                            <Paperclip size={18}/>
                                        </button>

                                        <input
                                            className="bg-transparent outline-none flex-1 font-outfit text-sm"
                                            style={{ color: '#F5EDD8', padding: '9px 0', lineHeight: 1.5 }}
                                            placeholder={t('chat.type_placeholder')}
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
                                            }}
                                        />

                                        {!input.trim() ? (
                                            <button
                                                style={{ color: 'rgba(201,168,76,0.25)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, lineHeight: 0, padding: 4 }}
                                                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.6)')}
                                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.25)')}
                                            >
                                                <Mic size={18}/>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={isSending}
                                                style={{
                                                    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                                                    background: '#C9A84C', color: '#080808',
                                                    border: 'none', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'all 0.2s',
                                                    boxShadow: '0 4px 16px rgba(201,168,76,0.2)',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#d9b960'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,168,76,0.3)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,168,76,0.2)'; }}
                                            >
                                                {isSending
                                                    ? <Loader2 size={16} className="animate-spin"/>
                                                    : <Send size={16} strokeWidth={2.5}/>
                                                }
                                            </button>
                                        )}
                                    </div>
                                </footer>
                            </div>
                        );
                    })()

                ) : selectedContact ? (
                    /* ── Handshake view ── */
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', textAlign: 'center' }} className="animate-scale-in">

                        <div
                            style={{
                                width: 80, height: 80, borderRadius: '50%', marginBottom: 20,
                                background: 'rgba(201,168,76,0.08)',
                                border: '1px solid rgba(201,168,76,0.22)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 40px rgba(201,168,76,0.08)',
                            }}
                        >
                            {selectedContact.avatarUrl
                                ? <img src={selectedContact.avatarUrl} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} alt={selectedContact.displayName}/>
                                : <span className="font-cormorant" style={{ fontSize: 28, color: '#C9A84C', fontWeight: 300 }}>{selectedContact.displayName.substring(0, 2).toUpperCase()}</span>
                            }
                        </div>

                        <h3 className="font-cormorant" style={{ fontSize: 28, fontWeight: 400, color: '#F5EDD8', marginBottom: 4, letterSpacing: '0.05em' }}>
                            {selectedContact.displayName}
                        </h3>
                        <p className="font-mono-dm" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(201,168,76,0.35)', marginBottom: 32 }}>
                            {selectedContact.phoneNumber}
                        </p>

                        <div
                            style={{
                                width: '100%', maxWidth: 380, borderRadius: 18,
                                background: 'rgba(13,13,13,0.9)',
                                border: '1px solid rgba(201,168,76,0.1)',
                                padding: '20px 24px', marginBottom: 16,
                                textAlign: 'left',
                            }}
                        >
                            <label className="field-label" style={{ marginBottom: 12, display: 'block' }}>
                                Mensagem inicial
                            </label>
                            <textarea
                                className="w-full bg-transparent outline-none font-outfit text-sm resize-none"
                                style={{ color: '#F5EDD8', lineHeight: 1.6, minHeight: 80 }}
                                placeholder="Escreva algo para iniciar o handshake..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                disabled={isSending}
                            />
                        </div>

                        <button
                            onClick={handleStartHandshake}
                            disabled={!input.trim() || isSending}
                            className="btn-gold"
                            style={{
                                width: '100%', maxWidth: 380, padding: '15px 0',
                                borderRadius: 16, fontSize: 11,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            }}
                        >
                            {isSending
                                ? <><Loader2 size={15} className="animate-spin"/> Processando Saga...</>
                                : <><ShieldCheck size={15}/> Estabelecer Handshake</>
                            }
                        </button>
                    </div>

                ) : (
                    /* ── Welcome view ── */
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 32 }}>
                        <div
                            className="animate-float"
                            style={{
                                width: 64, height: 64, borderRadius: 20, marginBottom: 24,
                                background: 'rgba(201,168,76,0.06)',
                                border: '1px solid rgba(201,168,76,0.12)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <ShieldCheck size={28} style={{ color: 'rgba(201,168,76,0.3)' }} strokeWidth={1.2}/>
                        </div>

                        <h2 className="font-cormorant" style={{ fontSize: 26, fontWeight: 300, color: 'rgba(201,168,76,0.5)', marginBottom: 12, letterSpacing: '0.05em' }}>
                            Bem-vindo, {user?.displayName}
                        </h2>

                        <div
                            style={{
                                maxWidth: 340, padding: '16px 24px', borderRadius: 16,
                                background: 'rgba(201,168,76,0.04)',
                                border: '1px solid rgba(201,168,76,0.08)',
                            }}
                        >
                            <p className="font-mono-dm" style={{ fontSize: 11, letterSpacing: '0.1em', lineHeight: 1.7, color: 'rgba(201,168,76,0.3)' }}>
                                <Trans
                                    i18nKey="chat.welcome_message"
                                    values={{ name: user?.displayName }}
                                    components={{ bold: <span style={{ color: 'rgba(201,168,76,0.55)' }}/> }}
                                />
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
