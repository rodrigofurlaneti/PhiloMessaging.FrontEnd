import { useEffect, useState } from 'react';
import { Link2, Copy, Trash2, Plus, X, Check } from 'lucide-react';
import { useInviteLinks } from '../hooks/useInviteLinks';

interface InviteLinkPanelProps {
  chatId: number;
  onClose: () => void;
}

export const InviteLinkPanel = ({ chatId, onClose }: InviteLinkPanelProps) => {
  const { links, isLoading, fetchLinks, createLink, revokeLink } = useInviteLinks(chatId);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${token}`);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="absolute right-0 top-20 w-80 max-h-96 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2 text-cyan-400">
          <Link2 size={16} />
          <h4 className="font-bold text-xs uppercase tracking-wide">Links de Convite</h4>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => createLink()}
            className="p-1.5 text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-all"
            title="Novo link"
          >
            <Plus size={14} />
          </button>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading ? (
          <p className="text-center text-gray-600 text-xs py-4">Carregando...</p>
        ) : links.length === 0 ? (
          <p className="text-center text-gray-600 text-xs py-4">Nenhum link de convite</p>
        ) : (
          links.map((link) => (
            <div key={link.token} className="bg-white/5 border border-white/10 rounded-xl p-3 group">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-cyan-400 font-mono truncate">{link.token.substring(0, 20)}...</p>
                  <div className="flex items-center gap-3 mt-1 text-[9px] text-gray-600">
                    <span>{link.useCount} usos</span>
                    {link.maxUses && <span>máx: {link.maxUses}</span>}
                    {link.expiresAt && <span>exp: {new Date(link.expiresAt).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => handleCopy(link.token)}
                    className="p-1.5 text-gray-500 hover:text-cyan-400 transition-colors"
                    title="Copiar link"
                  >
                    {copiedToken === link.token ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                  <button
                    onClick={() => revokeLink(link.token)}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                    title="Revogar"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
