import { useState } from 'react';
import { Plus, Eye, Loader2 } from 'lucide-react';
import { useStatus } from '../hooks/useStatus';
import { statusApi } from '../api/statusApi';
import type { CreateStatusRequest } from '../types';

export const StatusPanel = () => {
  const { myStatuses, contactStatuses, isLoading, refetch } = useStatus();
  const [showCreate, setShowCreate] = useState(false);
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!content.trim()) return;
    setIsCreating(true);
    try {
      const data: CreateStatusRequest = {
        type: 'Text',
        content,
        privacy: 'AllContacts',
      };
      await statusApi.create(data);
      setContent('');
      setShowCreate(false);
      refetch();
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" /></div>;
  }

  return (
    <div className="px-3 space-y-4">
      {/* My Status */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Meu Status</h3>
          <button onClick={() => setShowCreate(!showCreate)} className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-all">
            <Plus size={14} />
          </button>
        </div>

        {showCreate && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3 space-y-3">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-gray-300 resize-none h-16"
              placeholder="Escreva seu status..."
            />
            <button onClick={handleCreate} disabled={isCreating || !content.trim()} className="w-full py-2 bg-cyan-500 text-black rounded-xl text-xs font-bold uppercase disabled:opacity-50">
              {isCreating ? 'Publicando...' : 'Publicar Status'}
            </button>
          </div>
        )}

        {myStatuses.length === 0 ? (
          <p className="text-xs text-gray-500 px-1">Nenhum status ativo</p>
        ) : (
          myStatuses.map(s => (
            <div key={s.id} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl mb-2">
              <p className="text-sm text-white">{s.content}</p>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
                <Eye size={12} /> {s.viewsCount} visualizações
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contact Statuses */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 px-1">Contatos</h3>
        {contactStatuses.length === 0 ? (
          <p className="text-xs text-gray-500 px-1">Nenhum status de contato</p>
        ) : (
          contactStatuses.map(s => (
            <div
              key={s.id}
              onClick={() => statusApi.view(s.id)}
              className="p-3 bg-white/[0.03] border border-white/5 rounded-xl mb-2 cursor-pointer hover:bg-white/[0.05] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-[#080808] flex items-center justify-center text-xs font-bold text-cyan-400">
                    {(s.displayName ?? '??').substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{s.displayName}</p>
                  <p className="text-[10px] text-gray-500">{new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 ml-13">{s.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
