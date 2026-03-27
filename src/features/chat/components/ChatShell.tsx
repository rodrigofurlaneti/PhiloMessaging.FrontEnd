import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChatFeed } from '../hooks/useChatFeed';
import { useMessages } from '../hooks/useMessages';
import {
    LogOut, MessageSquare, Users, Settings, Search,
    Send, Paperclip, ShieldCheck, Loader2, UserPlus,
    User as UserIcon, Phone, Radio
} from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { LanguageSelector } from '../../../components/ui/LanguageSelector';
import { AddContactModal, ContactList } from '../../contacts';
import { useChatStore } from '../../../store/useChatStore';
import { chatApi } from '../api/chatApi';
import { SettingsPanel } from '../../settings';
import { CallHistoryPanel } from '../../calls';
import { StatusPanel } from '../../status';

export const ChatShell = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    const { chats, isLoading, refetch } = useChatFeed();
    const { selectedContact, setSelectedContact, activeChat, setActiveChat } = useChatStore();

    const currentChatId = (activeChat as any)?.chatId || (activeChat as any)?.id;

    // Hook de mensagens com a função de recarregar (refetch)
    const { messages, isLoading: messagesLoading, refetch: refetchMessages } = useMessages(currentChatId);

    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [view, setView] = useState<'chats' | 'contacts' | 'calls' | 'status' | 'settings'>('chats');
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);

    // FUNÇÃO: ENVIAR MENSAGEM NO CHAT ABERTO
    const handleSendMessage = async () => {
        if (!input.trim() || !currentChatId || isSending) return;

        setIsSending(true);
        try {
            // 1. Dispara a Saga no Backend
            await chatApi.sendMessageText(currentChatId, input);

            // 2. Limpa o campo imediatamente
            setInput('');

            // 3. Atualiza as mensagens para o novo balão aparecer
            if (refetchMessages) await refetchMessages();

            // 4. Atualiza a barra lateral para mostrar o último texto
            if (refetch) refetch();
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        } finally {
            setIsSending(false);
        }
    };

    // FUNÇÃO: HANDSHAKE INICIAL
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

    return (
        <div className="flex h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans">
            {isAddContactOpen && <AddContactModal onClose={() => setIsAddContactOpen(false)} />}

            {/* Sidebar Slim */}
            <aside className="w-20 flex flex-col items-center py-6 bg-black/40 border-r border-white/5 space-y-8">
                <div
                    onClick={() => { setView('chats'); setSelectedContact(null); setActiveChat(null); }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${view === 'chats' ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-transparent text-gray-600 hover:text-white'}`}
                >
                    <MessageSquare size={24} />
                </div>
                <div
                    onClick={() => setView('contacts')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${view === 'contacts' ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 'border-transparent text-gray-600 hover:text-white'}`}
                >
                    <Users size={24} />
                </div>
                <div
                    onClick={() => setView('calls')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${view === 'calls' ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'border-transparent text-gray-600 hover:text-white'}`}
                >
                    <Phone size={24} />
                </div>
                <div
                    onClick={() => setView('status')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${view === 'status' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' : 'border-transparent text-gray-600 hover:text-white'}`}
                >
                    <Radio size={24} />
                </div>
                <div
                    onClick={() => setView('settings')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${view === 'settings' ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'border-transparent text-gray-600 hover:text-white'}`}
                >
                    <Settings size={24} />
                </div>
                <div className="mt-auto flex flex-col items-center space-y-6">
                    <LanguageSelector variant="accordion" />
                    <button onClick={logout} className="p-3 text-gray-600 hover:text-red-500 transition-colors">
                        <LogOut size={24} />
                    </button>
                </div>
            </aside>

            {/* Master Column (Lista de Chats / Contacts / Calls / Status / Settings) */}
            {view === 'settings' ? (
                <section className="w-80 md:w-96 flex flex-col">
                    <SettingsPanel onClose={() => setView('chats')} />
                </section>
            ) : (
            <section className="w-80 md:w-96 bg-black/10 border-r border-white/5 flex flex-col">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className={`text-2xl font-black uppercase tracking-tighter ${
                            view === 'contacts' ? 'text-purple-500' :
                            view === 'calls' ? 'text-green-400' :
                            view === 'status' ? 'text-yellow-400' :
                            'text-white'
                        }`}>
                            {view === 'chats' ? 'Philo' :
                             view === 'contacts' ? t('contacts.title') :
                             view === 'calls' ? 'Chamadas' :
                             view === 'status' ? 'Status' : 'Philo'}
                        </h2>
                        {view === 'chats' && (
                            <button onClick={() => setIsAddContactOpen(true)} className="p-2 bg-white/5 hover:bg-cyan-500/10 border border-white/10 rounded-xl text-cyan-500 transition-all active:scale-90">
                                <UserPlus size={18} />
                            </button>
                        )}
                        {view === 'contacts' && (
                            <button onClick={() => setIsAddContactOpen(true)} className="p-2 bg-white/5 hover:bg-cyan-500/10 border border-white/10 rounded-xl text-cyan-500 transition-all active:scale-90">
                                <UserPlus size={18} />
                            </button>
                        )}
                    </div>
                    {(view === 'chats' || view === 'contacts') && (
                        <div className="relative flex items-center bg-white/5 rounded-2xl px-4 py-3 border border-transparent focus-within:border-cyan-500/30 transition-all">
                            <Search className="text-gray-500" size={18} />
                            <input type="text" className="bg-transparent ml-3 text-sm w-full outline-none" placeholder={t('chat.search_placeholder')} />
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto px-3 space-y-2">
                    {view === 'chats' ? (
                        isLoading ? <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" /></div> :
                            chats.map(chat => {
                                const isActive = currentChatId === chat.chatId;
                                return (
                                    <div
                                        key={chat.chatId}
                                        onClick={() => setActiveChat(chat)}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer group ${isActive ? 'bg-white/[0.08] border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.05)]' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h4 className={`font-bold text-sm transition-colors ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`}>{chat.chatName}</h4>
                                            <span className="text-[10px] text-gray-600">
                                                {chat.lastMessageSentAt ? new Date(chat.lastMessageSentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">{chat.lastMessageContent || '...'}</p>
                                        {chat.unreadCount > 0 && (
                                            <span className="inline-block mt-1 px-2 py-0.5 text-[9px] bg-cyan-500 text-black rounded-full font-bold">
                                                {chat.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                )
                            })
                    ) : view === 'contacts' ? (
                        <ContactList />
                    ) : view === 'calls' ? (
                        <CallHistoryPanel />
                    ) : view === 'status' ? (
                        <StatusPanel />
                    ) : null}
                </div>
            </section>
            )}

            {/* Detail Column (Centro - Mensagens) */}
            <main className="flex-1 flex flex-col bg-[#080808] relative">
                {activeChat ? (
                    (() => {
                        const chatData = activeChat as any;
                        const name = chatData.chatName || chatData.name || "Chat";
                        return (
                            <div className="flex flex-col h-full animate-in fade-in duration-500">
                                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center font-bold text-cyan-400 border border-cyan-500/20">
                                            {name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-white">{name}</h3>
                                            <p className="text-[10px] text-cyan-500 font-bold uppercase animate-pulse">Online</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-cyan-500/60 text-[10px] font-black uppercase tracking-widest">
                                        <ShieldCheck size={16} className="text-cyan-500" /> {t('chat.encrypted_tag')}
                                    </div>
                                </header>

                                {/* LISTA DE MENSAGENS */}
                                <div className="flex-1 p-8 overflow-y-auto flex flex-col space-y-4">
                                    {messagesLoading ? (
                                        <div className="flex justify-center"><Loader2 className="animate-spin text-cyan-500" /></div>
                                    ) : messages.length > 0 ? (
                                        messages.map((msg: any) => {
                                            // Comparação robusta de ID para definir o lado do balão
                                            const isMine = String(msg.senderId) === String(user?.id);

                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`max-w-[70%] p-3 rounded-2xl text-sm transition-all ${isMine
                                                            ? 'bg-cyan-500/20 border border-cyan-500/30 self-end rounded-tr-none text-cyan-50 shadow-[0_5px_15px_rgba(6,182,212,0.1)]'
                                                            : 'bg-white/5 border border-white/10 self-start rounded-tl-none text-gray-200'
                                                        }`}
                                                >
                                                    <p>{msg.content}</p>
                                                    <span className="text-[9px] opacity-40 mt-1 block text-right">
                                                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center">
                                            <p className="text-gray-600 text-center text-[10px] uppercase py-2 px-4 bg-white/5 rounded-full">Início da conversa criptografada</p>
                                        </div>
                                    )}
                                </div>

                                {/* FOOTER DE ENVIO */}
                                <footer className="p-6 bg-black/40 border-t border-white/5">
                                    <div className="max-w-4xl mx-auto flex items-center gap-4 bg-white/5 rounded-2xl p-2 border border-white/10 focus-within:border-cyan-500/30 transition-all">
                                        <button className="p-3 text-gray-500 hover:text-cyan-400 transition-colors"><Paperclip size={20} /></button>
                                        <input
                                            className="flex-1 bg-transparent outline-none text-sm p-2 text-gray-200"
                                            placeholder={t('chat.type_placeholder')}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={isSending || !input.trim()}
                                            className="p-3 bg-cyan-500 text-black rounded-xl hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                        </button>
                                    </div>
                                </footer>
                            </div>
                        );
                    })()
                ) : selectedContact ? (
                    /* VIEW: HANDSHAKE */
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-black p-[2px] mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            <div className="w-full h-full rounded-full bg-[#080808] flex items-center justify-center overflow-hidden">
                                {selectedContact.avatarUrl ? <img src={selectedContact.avatarUrl} className="w-full h-full object-cover" /> : <span className="text-2xl font-black text-purple-500">{selectedContact.displayName.substring(0, 2).toUpperCase()}</span>}
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">{selectedContact.displayName}</h3>
                        <p className="text-purple-500/60 font-mono text-[10px] mb-8 tracking-[0.2em]">{selectedContact.phoneNumber}</p>

                        <div className="w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-4 text-left">
                            <label className="text-[9px] font-black text-purple-500 uppercase mb-2 block tracking-widest opacity-70">Mensagem de Iniciação</label>
                            <textarea className="w-full bg-transparent outline-none text-sm text-gray-300 resize-none h-20 scrollbar-none" placeholder="Escreva algo para iniciar o handshake..." value={input} disabled={isSending} onChange={(e) => setInput(e.target.value)} />
                        </div>
                        <button onClick={handleStartHandshake} disabled={!input.trim() || isSending} className="w-full max-w-sm bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 transition-all">
                            {isSending ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                            {isSending ? "Processando Saga..." : "Estabelecer Handshake"}
                        </button>
                    </div>
                ) : (
                    /* VIEW: BOAS-VINDAS */
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="opacity-10 mb-8"><UserIcon size={120} strokeWidth={1} /></div>
                        <div className="max-w-md bg-white/5 p-6 rounded-2xl border border-white/10 text-sm text-gray-400">
                            <Trans i18nKey="chat.welcome_message" values={{ name: user?.displayName }} components={{ bold: <span className="text-cyan-400 font-bold" /> }} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};