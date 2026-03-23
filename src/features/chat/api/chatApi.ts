import { api } from '@/services/api';
import type {
  ChatDto,
  ChatFeedItemDto,
  CreateChatRequest,
  SendMessageSagaResult,
  SendMessageRequest,
  MessageDto,
} from '../types';

/**
 * chatApi — contrato completo com o Backend PhiloMessaging.
 *
 * Endpoints mapeados:
 * - GET    /api/v1/chats/feed
 * - POST   /api/v1/chats
 * - POST   /api/v1/chats/join/{token}                                    ← JoinGroup SAGA
 * - GET    /api/v1/chats/{chatId}/messages
 * - POST   /api/v1/chats/{chatId}/messages                               ← SendMessage SAGA
 * - DELETE /api/v1/chats/{chatId}/messages/{messageId}/for-everyone      ← Delete SAGA
 */
export const chatApi = {
  // ── Feed ─────────────────────────────────────────────────────────────────
  getChatFeed: async (): Promise<ChatFeedItemDto[]> => {
    const response = await api.get<ChatFeedItemDto[]>('/chats/feed');
    return response.data;
  },

  // ── Chat Management ───────────────────────────────────────────────────────
  createChat: async (request: CreateChatRequest): Promise<ChatDto> => {
    const response = await api.post<ChatDto>('/chats', request);
    return response.data;
  },

  /**
   * POST /api/v1/chats/join/{token}
   * Entra em um grupo via link de convite (executa JoinGroup SAGA no Backend).
   */
  joinViaLink: async (token: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/chats/join/${token}`);
    return response.data;
  },

  // ── Messages ──────────────────────────────────────────────────────────────
  getMessages: async (chatId: number, page = 1, pageSize = 50): Promise<MessageDto[]> => {
    const response = await api.get<MessageDto[]>(`/chats/${chatId}/messages`, {
      params: { page, pageSize },
    });
    return response.data;
  },

  /**
   * POST /api/v1/chats/{chatId}/messages
   * Dispara a SendMessage SAGA no Backend.
   * O Backend executa: ValidateMembership → PersistMessage →
   * UpdateChatLastMessage → CreateReceipts → DispatchNotifications
   */
  sendMessage: async (chatId: number, request: SendMessageRequest): Promise<SendMessageSagaResult> => {
    const response = await api.post<SendMessageSagaResult>(`/chats/${chatId}/messages`, request);
    return response.data;
  },

  /** Atalho para envio de texto simples (MessageType = 1). */
  sendMessageText: async (chatId: number, content: string): Promise<SendMessageSagaResult> => {
    return chatApi.sendMessage(chatId, {
      type: 1,
      content,
      contentEncrypted: true,
    });
  },

  /**
   * DELETE /api/v1/chats/{chatId}/messages/{messageId}/for-everyone
   * Apaga mensagem para todos. Backend valida janela de 60 minutos.
   */
  deleteMessageForEveryone: async (chatId: number, messageId: number): Promise<void> => {
    await api.delete(`/chats/${chatId}/messages/${messageId}/for-everyone`);
  },
};