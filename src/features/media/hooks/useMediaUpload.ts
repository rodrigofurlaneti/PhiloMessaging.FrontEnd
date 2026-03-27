import { useState } from 'react';
import { mediaApi } from '../api/mediaApi';
import type { MediaUploadResult } from '../types';

export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (
    chatId: number,
    file: File,
    type: 'image' | 'audio' | 'video' | 'document'
  ): Promise<MediaUploadResult | null> => {
    setIsUploading(true);
    setProgress(0);
    try {
      const uploadFn = {
        image: mediaApi.uploadImage,
        audio: mediaApi.uploadAudio,
        video: mediaApi.uploadVideo,
        document: mediaApi.uploadDocument,
      }[type];
      const result = await uploadFn(chatId, file);
      setProgress(100);
      return result;
    } catch (err) {
      console.error(`Failed to upload ${type}:`, err);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, progress, upload };
};
