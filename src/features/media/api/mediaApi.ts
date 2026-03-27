import { api } from '@/services/api';
import type { MediaUploadResult } from '../types';

export const mediaApi = {
  uploadImage: (chatId: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<MediaUploadResult>('/media/upload-image', form, {
      params: { chatId },
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },

  uploadAudio: (chatId: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<MediaUploadResult>('/media/upload-audio', form, {
      params: { chatId },
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },

  uploadVideo: (chatId: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<MediaUploadResult>('/media/upload-video', form, {
      params: { chatId },
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },

  uploadDocument: (chatId: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<MediaUploadResult>('/media/upload-document', form, {
      params: { chatId },
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
};
