import { useState } from 'react';
import { BarChart3, Plus, X, Send } from 'lucide-react';
import { pollsApi } from '../api/pollsApi';
import type { CreatePollRequest } from '../types';

interface PollCreatorProps {
  chatId: number;
  onCreated: () => void;
  onClose: () => void;
}

export const PollCreator = ({ chatId, onCreated, onClose }: PollCreatorProps) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [multiChoice, setMultiChoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    if (options.length < 10) setOptions([...options, '']);
  };

  const removeOption = (idx: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== idx));
  };

  const updateOption = (idx: number, value: string) => {
    setOptions(options.map((o, i) => (i === idx ? value : o)));
  };

  const handleSubmit = async () => {
    const validOptions = options.filter(o => o.trim());
    if (!question.trim() || validOptions.length < 2) return;

    setIsSubmitting(true);
    try {
      const data: CreatePollRequest = {
        chatId,
        question: question.trim(),
        options: validOptions,
        isAnonymous,
        multiChoice,
      };
      await pollsApi.create(data);
      onCreated();
      onClose();
    } catch (err) {
      console.error('Failed to create poll:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400">
            <BarChart3 size={20} />
            <h3 className="font-bold text-sm uppercase tracking-wide">Criar Enquete</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500/30 transition-all"
          placeholder="Pergunta da enquete..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div className="space-y-2">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500/30 transition-all"
                placeholder={`Opção ${idx + 1}`}
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
              />
              {options.length > 2 && (
                <button onClick={() => removeOption(idx)} className="p-2 text-gray-600 hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          {options.length < 10 && (
            <button onClick={addOption} className="flex items-center gap-2 text-cyan-500/60 hover:text-cyan-400 text-xs font-bold uppercase tracking-wide transition-colors">
              <Plus size={14} /> Adicionar opção
            </button>
          )}
        </div>

        <div className="flex items-center gap-6 text-xs text-gray-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="accent-cyan-500" />
            Anônima
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={multiChoice} onChange={(e) => setMultiChoice(e.target.checked)} className="accent-cyan-500" />
            Múltipla escolha
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !question.trim() || options.filter(o => o.trim()).length < 2}
          className="w-full bg-cyan-500 text-black font-bold py-3 rounded-xl hover:bg-cyan-400 disabled:opacity-30 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
        >
          <Send size={16} /> Criar Enquete
        </button>
      </div>
    </div>
  );
};
