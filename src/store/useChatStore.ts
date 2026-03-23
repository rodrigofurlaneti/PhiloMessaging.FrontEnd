import { create } from 'zustand';
import type { ContactDto } from '../features/contacts/types';
import type { ChatDto, ChatFeedItemDto } from '../features/chat/types'; 

interface ChatState {
    selectedContact: ContactDto | null;
    activeChat: ChatDto | ChatFeedItemDto | null;
    setSelectedContact: (contact: ContactDto | null) => void;
    setActiveChat: (chat: ChatDto | ChatFeedItemDto | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    selectedContact: null,
    activeChat: null,

    setSelectedContact: (contact) => set({
        selectedContact: contact,
        activeChat: null // Se estou vendo um perfil de contato, não estou em um chat ativo
    }),

    setActiveChat: (chat) => set({
        activeChat: chat,
        selectedContact: null // Se entrei no chat, fecho o preview do contato
    }),
}));