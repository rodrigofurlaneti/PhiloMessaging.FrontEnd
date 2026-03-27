import { useState, useCallback } from 'react';
import { inviteLinksApi } from '../api/inviteLinksApi';
import type { InviteLinkDto, CreateInviteLinkRequest } from '../types';

export const useInviteLinks = (chatId: number) => {
  const [links, setLinks] = useState<InviteLinkDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await inviteLinksApi.getAll(chatId);
      setLinks(data);
    } catch (err) {
      console.error('Failed to fetch invite links:', err);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  const createLink = async (data?: CreateInviteLinkRequest) => {
    const link = await inviteLinksApi.create(chatId, data);
    setLinks(prev => [...prev, link]);
    return link;
  };

  const revokeLink = async (token: string) => {
    await inviteLinksApi.revoke(chatId, token);
    setLinks(prev => prev.filter(l => l.token !== token));
  };

  return { links, isLoading, fetchLinks, createLink, revokeLink };
};
