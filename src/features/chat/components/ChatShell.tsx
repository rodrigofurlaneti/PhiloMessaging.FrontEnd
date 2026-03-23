import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChatFeed } from '../hooks/useChatFeed';
import {
    LogOut, MessageSquare, Users, Settings, Search,
    Send, Paperclip, ShieldCheck, Loader2, UserPlus
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../../components/ui/LanguageSelector';
import { AddContactModal, ContactList } from '../../contacts';

export const ChatShell = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const { chats, isLoading } = useChatFeed();

    // Estados para o Modal e View (Alternar entre Conversas e Contatos)
    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [view, setView] = useState<'chats' | 'contacts'>('chats');

    // Estado do input de mensagem
    const [input, setInput] = useState('');

    return (
        <div className="flex h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans">
            {/* Modal de Adicionar Contato */}
            {isAddContactOpen && <AddContactModal onClose={() => setIsAddContactOpen(false)} />}

            {/* Sidebar Slim (Navegação Esquerda) */}
            <aside className="w-20 flex flex-col items-center py-6 bg-black/40 border-r border-white/5 space-y-8">
                <div
                    onClick={() => setView('chats')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${view === 'chats' ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-transparent text-gray-600 hover:text-white'}`}
                >
                    <MessageSquare size={24} />
                </div>
                <div
                    onClick={() => setView('contacts')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${view === 'contacts' ? 'bg-purple-500/20 border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'border-transparent text-gray-600 hover:text-white'}`}
                >
                    <Users size={24} />
                </div>
                <Settings className="text-gray-600 hover:text-white cursor-pointer transition-colors" size={24} />

                <div className="mt-auto flex flex-col items-center space-y-6">
                    <LanguageSelector variant="accordion" />
                    <button
                        onClick={logout}
                        className="p-3 text-gray-600 hover:text-red-500 transition-colors"
                        title={t('auth.logout') || 'Sair'}
                    >
                        <LogOut size={24} />
                    </button>
                </div>
            </aside>

            {/* Master Column (Lista de Chats ou Contatos) */}
            <section className="w-80 md:w-96 bg-black/10 border-r border-white/5 flex flex-col">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-black uppercase tracking-tighter">
                            {view === 'chats' ? 'Philo' : t('contacts.title') || 'Contatos'}
                        </h2>
                        <button
                            onClick={() => setIsAddContactOpen(true)}
                            className="p-2 bg-white/5 hover:bg-cyan-500/10 border border-white/10 rounded-xl text-cyan-500 transition-all active:scale-90"
                        >
                            <UserPlus size={18} />
                        </button>
                    </div>
                    <div className="relative flex items-center bg-white/5 rounded-2xl px-4 py-3 border border-transparent focus-within:border-cyan-500/30 transition-all">
                        <Search className="text-gray-500" size={18} />
                        <input
                            type="text"
                            className="bg-transparent ml-3 text-sm w-full outline-none"
                            placeholder={t('chat.search_placeholder') || "Procurar..."}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 space-y-2">
                    {view === 'chats' ? (
                        isLoading ? (
                            <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" /></div>
                        ) : (
                            chats.map(chat => (
                                <div key={chat.chatId} className="p-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl border border-white/5 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-sm group-hover:text-cyan-400 transition-colors">{chat.chatName}</h4>
                                        <span className="text-[10px] text-gray-600">12:45</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{chat.lastMessageContent || 'Nenhuma mensagem...'}</p>
                                </div>
                            ))
                        )
                    ) : (
                        <ContactList />
                    )}
                </div>
            </section>

            {/* Detail Column (Área de Mensagens) */}
            <main className="flex-1 flex flex-col bg-[#080808]">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center font-bold text-cyan-500 border border-cyan-500/20">
                            PS
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Suporte Philo</h3>
                            <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest animate-pulse">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-500/60 text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck size={16} className="text-cyan-500" /> E2E Encrypted
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-md bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 text-sm leading-relaxed">
                        Olá <span className="text-cyan-400 font-bold">{user?.displayName}</span>, bem-vindo à rede criptografada Philo.
                    </div>
                </div>

                <footer className="p-6 bg-black/40 backdrop-blur-xl border-t border-white/5">
                    <div className="max-w-4xl mx-auto flex items-center gap-4 bg-white/5 rounded-2xl p-2 border border-white/10 focus-within:border-cyan-500/30 transition-all shadow-2xl">
                        <button className="p-3 text-gray-500 hover:text-cyan-500 transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm p-2 text-gray-200"
                            placeholder={t('chat.type_placeholder') || "Escreva algo..."}
                        />
                        <button className="p-3 bg-cyan-500 text-black rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            <Send size={20} />
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    );
};