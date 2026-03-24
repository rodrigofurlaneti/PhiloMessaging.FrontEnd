import { api } from '@/services/api';

export interface MediaUploadResult {
  url: string;
}

/**
 * API de upload de mídias.
 * Mapeia para o MediaController do Backend:
 * - POST /api/media/upload-image
 * - POST /api/media/upload-audio
 * - POST /api/media/upload-video
 * - POST /api/media/upload-document
 */
export const mediaApi = {
  uploadImage: async (file: File, chatId: number): Promise<MediaUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<MediaUploadResult>(
      `/media/upload-image?chatId=${chatId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },

  uploadAudio: async (file: File, chatId: number): Promise<MediaUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<MediaUploadResult>(
      `/media/upload-audio?chatId=${chatId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },

  uploadVideo: async (file: File, chatId: number): Promise<MediaUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<MediaUploadResult>(
      `/media/upload-video?chatId=${chatId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60s para vídeos grandes
      }
    );
    return data;
  },

  uploadDocument: async (file: File, chatId: number): Promise<MediaUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<MediaUploadResult>(
      `/media/upload-document?chatId=${chatId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },

  /**
   * Detecta automaticamente o tipo de arquivo e faz o upload correto.
   * Retorna também o MessageType correspondente para o Backend.
   */
  uploadAuto: async (
    file: File,
    chatId: number
  ): Promise<{ url: string; messageType: number }> => {
    const mime = file.type;

    if (mime.startsWith('image/')) {
      const result = await mediaApi.uploadImage(file, chatId);
      return { url: result.url, messageType: 2 }; // MessageType.Image = 2
    }
    if (mime.startsWith('video/')) {
      const result = await mediaApi.uploadVideo(file, chatId);
      return { url: result.url, messageType: 3 }; // MessageType.Video = 3
    }
    if (mime.startsWith('audio/')) {
      const result = await mediaApi.uploadAudio(file, chatId);
      return { url: result.url, messageType: 4 }; // MessageType.Audio = 4
    }

    // Qualquer outro tipo = documento
    const result = await mediaApi.uploadDocument(file, chatId);
    return { url: result.url, messageType: 5 }; // MessageType.Document = 5
  },
};
