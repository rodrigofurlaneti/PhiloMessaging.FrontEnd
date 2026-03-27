import { useCallback } from 'react';
import { messagesApi } from '../api/messagesApi';

export const useMessageActions = () => {
  const markRead = useCallback(async (chatId: number, messageId: number) => {
    try {
      await messagesApi.markRead(chatId, messageId);
    } catch (err) {
      console.error('Failed to mark message as read:', err);
    }
  }, []);

  const deleteForEveryone = useCallback(async (chatId: number, messageId: number) => {
    try {
      await messagesApi.deleteForEveryone(chatId, messageId);
      return true;
    } catch (err) {
      console.error('Failed to delete message for everyone:', err);
      return false;
    }
  }, []);

  return { markRead, deleteForEveryone };
};
