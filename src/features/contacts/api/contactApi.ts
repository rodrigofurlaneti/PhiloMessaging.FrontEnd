import { api } from '@/services/api';
import type { ContactDto, AddContactRequest, UpdateNicknameRequest } from '../types';
export const contactApi = {
    getContacts: () =>
        api.get<ContactDto[]>('/contacts').then((res) => res.data),
    addContact: (data: AddContactRequest) =>
        api.post<ContactDto>('/contacts', data).then((res) => res.data),
    removeContact: (contactUserId: number) =>
        api.delete(`/contacts/${contactUserId}`),
    blockContact: (contactUserId: number) =>
        api.patch(`/contacts/${contactUserId}/block`),
    updateNickname: (data: UpdateNicknameRequest) =>
        api.patch(`/contacts/${data.contactUserId}/nickname`, { newNickname: data.newNickname })
};