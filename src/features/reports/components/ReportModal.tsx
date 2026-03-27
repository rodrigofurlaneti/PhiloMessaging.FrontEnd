import { useState } from 'react';
import { Flag, X, Send } from 'lucide-react';
import { reportsApi } from '../api/reportsApi';
import type { CreateReportRequest } from '../types';

interface ReportModalProps {
  targetType: 'User' | 'Message' | 'Group';
  targetId: number;
  onClose: () => void;
}

const reasons = [
  'Spam',
  'Conteúdo impróprio',
  'Assédio',
  'Informação falsa',
  'Violência',
  'Outro',
];

export const ReportModal = ({ targetType, targetId, onClose }: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const reason = selectedReason === 'Outro' ? customReason.trim() : selectedReason;
    if (!reason) return;

    setIsSubmitting(true);
    try {
      const data: CreateReportRequest = { targetType, targetId, reason };
      await reportsApi.create(data);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400">
            <Flag size={18} />
            <h3 className="font-bold text-sm uppercase tracking-wide">Denunciar</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <p className="text-green-400 font-bold text-sm mb-1">Denúncia enviada</p>
            <p className="text-gray-500 text-xs">Obrigado por nos ajudar a manter a comunidade segura.</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-all"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500">Selecione o motivo:</p>
            <div className="space-y-2">
              {reasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all border ${
                    selectedReason === reason
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            {selectedReason === 'Outro' && (
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500/30 resize-none h-20 transition-all"
                placeholder="Descreva o motivo..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedReason || (selectedReason === 'Outro' && !customReason.trim())}
              className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-400 disabled:opacity-30 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
            >
              <Send size={16} /> Enviar Denúncia
            </button>
          </>
        )}
      </div>
    </div>
  );
};
