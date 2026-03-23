import { create } from 'zustand';
import type { ContactDto } from '../features/contacts/types';
import type { AnyMessage, ChatDto, ChatFeedItemDto, OptimisticMessage } from '../features/chat/types';

/**
 * useChatStore — Estado global do Chat usando Zustand.
 *
 * Gerencia:
 * - Chat ativo e contato selecionado (navegação)
 * - Mensagens locais com suporte a mensagens otimistas (SAGA pattern)
 * - Feed de conversas (sidebar)
 * - Estado de conectividade SignalR
 */

interface ChatState {
  // ── Navegação ──────────────────────────────────────────────────────────
  selectedContact: ContactDto | null;
  activeChat: ChatDto | ChatFeedItemDto | null;

  // ── Mensagens locais (com suporte otimista) ───────────────────────────
  messagesByChatId: Record<number, AnyMessage[]>;

  // ── Feed de conversas ─────────────────────────────────────────────────
  chatFeed: ChatFeedItemDto[];

  // ── SignalR ───────────────────────────────────────────────────────────
  isHubConnected: boolean;

  // ── Actions de Navegação ──────────────────────────────────────────────
  setSelectedContact: (contact: ContactDto | null) => void;
  setActiveChat: (chat: ChatDto | ChatFeedItemDto | null) => void;

  // ── Actions de Mensagens ──────────────────────────────────────────────
  setMessages: (chatId: number, messages: AnyMessage[]) => void;
  addOptimisticMessage: (msg: OptimisticMessage) => void;
  confirmOptimisticMessage: (chatId: number, tempId: string, realMsg: AnyMessage) => void;
  removeOptimisticMessage: (chatId: number, tempId: string) => void;
  markMessageDeleted: (chatId: number, messageId: number) => void;
  restoreMessage: (chatId: number, messageId: number) => void;
  appendIncomingMessage: (msg: AnyMessage) => void;

  // ── Actions de Feed ───────────────────────────────────────────────────
  setChatFeed: (feed: ChatFeedItemDto[]) => void;
  updateChatInFeed: (chat: ChatFeedItemDto) => void;

  // ── Actions SignalR ───────────────────────────────────────────────────
  setHubConnected: (connected: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // ── Estado Inicial ──────────────────────────────────────────────────────
  selectedContact: null,
  activeChat: null,
  messagesByChatId: {},
  chatFeed: [],
  isHubConnected: false,

  // ── Navegação ────────────────────────────────────────────────────────────
  setSelectedContact: (contact) =>
    set({ selectedContact: contact, activeChat: null }),

  setActiveChat: (chat) =>
    set({ activeChat: chat, selectedContact: null }),

  // ── Mensagens ─────────────────────────────────────────────────────────────
  setMessages: (chatId, messages) =>
    set(state => ({
      messagesByChatId: { ...state.messagesByChatId, [chatId]: messages },
    })),

  addOptimisticMessage: (msg) =>
    set(state => {
      const existing = state.messagesByChatId[msg.chatId] ?? [];
      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [msg.chatId]: [...existing, msg],
        },
      };
    }),

  confirmOptimisticMessage: (chatId, _tempId, realMsg) =>
    set(state => {
      const msgs = state.messagesByChatId[chatId] ?? [];
      // Remove a mensagem otimista pendente (id negativo) e adiciona a real
      const withoutOptimistic = msgs.filter(
        m => !(m as OptimisticMessage).isOptimistic || (m as OptimisticMessage).isPending === false
      );
      // Verifica se a mensagem real já existe para não duplicar
      const alreadyExists = withoutOptimistic.some(m => m.id === realMsg.id);
      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: alreadyExists ? withoutOptimistic : [...withoutOptimistic, realMsg],
        },
      };
    }),

  removeOptimisticMessage: (chatId, _tempId) =>
    set(state => {
      const msgs = state.messagesByChatId[chatId] ?? [];
      // Remove a última mensagem otimista pendente (compensação SAGA)
      const idx = [...msgs].reverse().findIndex(
        m => (m as OptimisticMessage).isOptimistic && (m as OptimisticMessage).isPending
      );
      if (idx === -1) return state;
      const realIdx = msgs.length - 1 - idx;
      const newMsgs = msgs.filter((_, i) => i !== realIdx);
      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: newMsgs,
        },
      };
    }),

  markMessageDeleted: (chatId, messageId) =>
    set(state => {
      const msgs = state.messagesByChatId[chatId] ?? [];
      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: msgs.map(m =>
            m.id === messageId ? { ...m, deletedForEveryone: true } : m
          ),
        },
      };
    }),

  restoreMessage: (chatId, messageId) =>
    set(state => {
      const msgs = state.messagesByChatId[chatId] ?? [];
      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: msgs.map(m =>
            m.id === messageId ? { ...m, deletedForEveryone: false } : m
          ),
        },
      };
    }),

  appendIncomingMessage: (msg) => {
    const state = get();
    const existing = state.messagesByChatId[msg.chatId] ?? [];
    const alreadyExists = existing.some(m => m.id === msg.id);
    if (alreadyExists) return;
    set({
      messagesByChatId: {
        ...state.messagesByChatId,
        [msg.chatId]: [...existing, msg],
      },
    });
  },

  // ── Feed ──────────────────────────────────────────────────────────────────
  setChatFeed: (feed) => set({ chatFeed: feed }),

  updateChatInFeed: (updatedChat) =>
    set(state => {
      const filtered = state.chatFeed.filter(c => c.chatId !== updatedChat.chatId);
      return { chatFeed: [updatedChat, ...filtered] };
    }),

  // ── SignalR ───────────────────────────────────────────────────────────────
  setHubConnected: (connected) => set({ isHubConnected: connected }),
}));