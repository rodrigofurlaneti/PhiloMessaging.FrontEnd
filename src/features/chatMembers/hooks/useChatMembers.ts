import { useState, useEffect, useCallback } from 'react';
import { chatMembersApi } from '../api/chatMembersApi';
import type { ChatMemberDto } from '../types';

export const useChatMembers = (chatId: number | null) => {
  const [members, setMembers] = useState<ChatMemberDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!chatId) return;
    setIsLoading(true);
    try {
      const data = await chatMembersApi.getMembers(chatId);
      setMembers(data);
    } catch (err) {
      console.error('Failed to fetch chat members:', err);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  return { members, isLoading, refetch: fetchMembers };
};
