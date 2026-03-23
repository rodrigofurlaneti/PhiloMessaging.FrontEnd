import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from '../context/AuthContext';
import { useChatStore } from '@/store/useChatStore';
import type { MessageDto } from '../types';

const HUB_URL = import.meta.env.VITE_HUB_URL || 'https://localhost:61799/chatHub';

/**
 * useChatHub — Gerencia a conexão SignalR com o ChatHub do Backend.
 *
 * Integrado ao useChatStore para:
 * - Receber mensagens em tempo real → appendIncomingMessage
 * - Atualizar status de entrega (message_receipts)
 * - Indicar presença/online de outros usuários
 * - Notificar sobre mensagens deletadas
 *
 * Events do Hub esperados:
 * - "ReceiveMessage"       → nova mensagem recebida
 * - "MessageDeleted"       → mensagem apagada para todos
 * - "UserOnline"           → usuário ficou online
 * - "UserOffline"          → usuário ficou offline
 * - "MessageDelivered"     → confirmação de entrega
 * - "MessageRead"          → confirmação de leitura
 */
export const useChatHub = () => {
  const { user } = useAuth();
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const appendIncomingMessage = useChatStore(state => state.appendIncomingMessage);
  const markMessageDeleted = useChatStore(state => state.markMessageDeleted);
  const setHubConnected = useChatStore(state => state.setHubConnected);

  useEffect(() => {
    const token = localStorage.getItem('@PhiloMessaging:token');
    if (!token || !user) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => localStorage.getItem('@PhiloMessaging:token') ?? '',
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    // ── Handlers de Eventos do Hub ──────────────────────────────────────────

    /** Nova mensagem recebida em tempo real */
    connection.on('ReceiveMessage', (message: MessageDto) => {
      console.log('[SignalR] ReceiveMessage:', message);
      appendIncomingMessage(message);
    });

    /** Mensagem apagada para todos — Backend DeleteMessage SAGA concluída */
    connection.on('MessageDeleted', (chatId: number, messageId: number) => {
      console.log('[SignalR] MessageDeleted:', { chatId, messageId });
      markMessageDeleted(chatId, messageId);
    });

    /** Usuário ficou online */
    connection.on('UserOnline', (userId: number) => {
      console.log('[SignalR] UserOnline:', userId);
    });

    /** Usuário ficou offline */
    connection.on('UserOffline', (userId: number) => {
      console.log('[SignalR] UserOffline:', userId);
    });

    /** Confirmação de entrega de mensagem (✓✓ cinza) */
    connection.on('MessageDelivered', (messageId: number) => {
      console.log('[SignalR] MessageDelivered:', messageId);
    });

    /** Confirmação de leitura (✓✓ azul) */
    connection.on('MessageRead', (messageId: number, userId: number) => {
      console.log('[SignalR] MessageRead:', { messageId, userId });
    });

    // ── Reconexão ────────────────────────────────────────────────────────────
    connection.onreconnecting(() => {
      console.log('[SignalR] Reconectando...');
      setHubConnected(false);
    });

    connection.onreconnected(() => {
      console.log('[SignalR] Reconectado com sucesso.');
      setHubConnected(true);
    });

    connection.onclose(() => {
      console.log('[SignalR] Conexão encerrada.');
      setHubConnected(false);
    });

    // ── Iniciar Conexão ───────────────────────────────────────────────────────
    connection
      .start()
      .then(() => {
        console.log(`[SignalR] Conectado ao Philo Hub como: ${user.displayName}`);
        setHubConnected(true);
      })
      .catch(err => {
        console.error('[SignalR] Erro na conexão:', err);
        setHubConnected(false);
      });

    return () => {
      connection.stop();
      connectionRef.current = null;
      setHubConnected(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  return connectionRef.current;
};