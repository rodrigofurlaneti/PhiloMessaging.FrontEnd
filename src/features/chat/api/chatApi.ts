import { api } from '@/services/api';
import type {
    ChatDto,
    ChatFeedItemDto,
    CreateChatRequest,
    SendMessageSagaResult,
    SendMessageRequest,
    MessageDto,
} from '../types';

export const chatApi = {
    // ── Mensagens ─────────────────────────────────────────────────────────────

    /** Busca o histórico paginado de mensagens de um chat */
    getMessages: async (chatId: number, page = 1, pageSize = 50): Promise<MessageDto[]> => {
        const response = await api.get<MessageDto[]>(`/chats/${chatId}/messages`, {
            params: { page, pageSize },
        });
        return response.data;
    },

    /**
     * Envia uma mensagem de texto simples (atalho — não usa a Saga completa).
     * Mantido por compatibilidade com o ChatShell legado.
     */
    sendMessageText: async (chatId: number, content: string): Promise<SendMessageSagaResult> => {
        const response = await api.post<SendMessageSagaResult>(`/chats/${chatId}/messages`, {
            type: 1,
            content,
            contentEncrypted: true,
        });
        return response.data;
    },

    /**
     * Envia uma mensagem com payload completo (usado pelo useSendMessageSaga).
     * Suporta tipo, resposta (replyToId) e encaminhamento (forwardedFromId).
     */
    sendMessage: async (
        chatId: number,
        request: SendMessageRequest,
    ): Promise<SendMessageSagaResult> => {
        const response = await api.post<SendMessageSagaResult>(
            `/chats/${chatId}/messages`,
            request,
        );
        return response.data;
    },

    /**
     * Apaga uma mensagem para todos os membros do chat.
     * Só é permitido dentro da janela de 60 minutos (validado também no backend).
     * Endpoint: DELETE /chats/{chatId}/messages/{messageId}/for-everyone
     */
    deleteMessageForEveryone: async (
        chatId: number,
        messageId: number,
    ): Promise<void> => {
        await api.delete(`/chats/${chatId}/messages/${messageId}/for-everyone`);
    },

    // ── Chats ─────────────────────────────────────────────────────────────────

    /** Cria um chat privado, grupo ou broadcast */
    createChat: async (request: CreateChatRequest): Promise<ChatDto> => {
        const response = await api.post<ChatDto>('/chats', request);
        return response.data;
    },

    /** Retorna o feed de conversas do usuário autenticado */
    getChatFeed: async (): Promise<ChatFeedItemDto[]> => {
        const response = await api.get<ChatFeedItemDto[]>('/chats/feed');
        return response.data;
    },

    /**
     * Entra em um grupo usando um link de convite.
     * Endpoint: POST /chats/join/{token}
     */
    joinViaLink: async (token: string): Promise<void> => {
        await api.post(`/chats/join/${token}`);
    },
};
