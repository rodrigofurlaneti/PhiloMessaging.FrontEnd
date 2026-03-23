import { useState, useEffect, useCallback } from 'react';
import { contactApi } from '../api/contactApi';
import type { ContactDto, AddContactRequest } from '../types';
import { toast } from 'react-toastify';

export const useContacts = () => {
    const [contacts, setContacts] = useState<ContactDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMutationLoading, setIsMutationLoading] = useState(false); 

    const fetchContacts = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await contactApi.getContacts();
            setContacts(data);
        } catch (error) {
            toast.error("Erro ao carregar lista de contatos.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addContact = async (request: AddContactRequest) => {
        setIsMutationLoading(true); // Bloqueia o botão no modal
        try {
            const newContact = await contactApi.addContact(request);

            // Atualiza o estado garantindo que não estamos duplicando
            setContacts(prev => {
                const exists = prev.some(c => c.contactUserId === newContact.contactUserId);
                return exists ? prev : [...prev, newContact];
            });

            toast.success("Contato adicionado com sucesso!");
        } catch (error: any) {
            const message = error.response?.data?.Message || "Erro ao adicionar contato.";
            toast.error(message);
        } finally {
            setIsMutationLoading(false);
        }
    };

    const removeContact = async (userId: number) => {
        try {
            await contactApi.removeContact(userId);
            setContacts(prev => prev.filter(c => c.contactUserId !== userId));
            toast.info("Contato removido.");
        } catch (error) {
            toast.error("Erro ao remover contato.");
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    return {
        contacts,
        isLoading,
        isMutationLoading, // Retorne este estado para o Modal usar no 'disabled' do botão
        addContact,
        removeContact,
        refresh: fetchContacts
    };
};