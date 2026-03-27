import { useRef, useState } from 'react';
import { Image, FileAudio, Video, FileText, X, Loader2 } from 'lucide-react';
import { useMediaUpload } from '../hooks/useMediaUpload';

interface MediaUploadMenuProps {
  chatId: number;
  onUploaded: () => void;
  onClose: () => void;
}

type MediaType = 'image' | 'audio' | 'video' | 'document';

const mediaOptions: { type: MediaType; icon: typeof Image; label: string; accept: string; color: string }[] = [
  { type: 'image', icon: Image, label: 'Imagem', accept: 'image/*', color: 'text-green-400' },
  { type: 'audio', icon: FileAudio, label: 'Áudio', accept: 'audio/*', color: 'text-purple-400' },
  { type: 'video', icon: Video, label: 'Vídeo', accept: 'video/*', color: 'text-blue-400' },
  { type: 'document', icon: FileText, label: 'Documento', accept: '*/*', color: 'text-orange-400' },
];

export const MediaUploadMenu = ({ chatId, onUploaded, onClose }: MediaUploadMenuProps) => {
  const { isUploading, upload } = useMediaUpload();
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<MediaType | null>(null);

  const handleSelect = (type: MediaType, accept: string) => {
    setSelectedType(type);
    if (fileRef.current) {
      fileRef.current.accept = accept;
      fileRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedType) return;

    const result = await upload(chatId, file, selectedType);
    if (result) {
      onUploaded();
    }
    onClose();
  };

  return (
    <div className="absolute bottom-20 left-6 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl p-3 z-40">
      <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />

      {isUploading ? (
        <div className="flex items-center gap-2 px-4 py-3 text-cyan-400 text-xs">
          <Loader2 size={16} className="animate-spin" /> Enviando...
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Anexar</span>
            <button onClick={onClose} className="p-1 text-gray-600 hover:text-white transition-colors">
              <X size={12} />
            </button>
          </div>
          {mediaOptions.map(({ type, icon: Icon, label, accept, color }) => (
            <button
              key={type}
              onClick={() => handleSelect(type, accept)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left"
            >
              <Icon size={18} className={color} />
              <span className="text-sm text-gray-300">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
