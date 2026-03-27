import { useEffect } from 'react';
import { Pin, X } from 'lucide-react';
import { usePinnedMessages } from '../hooks/usePinnedMessages';

interface PinnedMessagesPanelProps {
  chatId: number;
  onClose: () => void;
}

export const PinnedMessagesPanel = ({ chatId, onClose }: PinnedMessagesPanelProps) => {
  const { pinnedMessages, isLoading, fetchPinned, unpin } = usePinnedMessages(chatId);

  useEffect(() => {
    fetchPinned();
  }, [fetchPinned]);

  return (
    <div className="absolute right-0 top-20 w-80 max-h-96 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2 text-yellow-400">
          <Pin size={16} />
          <h4 className="font-bold text-xs uppercase tracking-wide">Mensagens Fixadas</h4>
        </div>
        <button onClick={onClose} className="p-1 text-gray-500 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading ? (
          <p className="text-center text-gray-600 text-xs py-4">Carregando...</p>
        ) : pinnedMessages.length === 0 ? (
          <p className="text-center text-gray-600 text-xs py-4">Nenhuma mensagem fixada</p>
        ) : (
          pinnedMessages.map((pm) => (
            <div key={`${pm.chatId}-${pm.messageId}`} className="bg-white/5 border border-white/10 rounded-xl p-3 group">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 truncate">{pm.messageContent || 'Mensagem'}</p>
                  <span className="text-[9px] text-gray-600 mt-1 block">
                    {pm.pinnedByName || 'Usuário'} · {new Date(pm.pinnedAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => unpin(pm.messageId)}
                  className="p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Desafixar"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
