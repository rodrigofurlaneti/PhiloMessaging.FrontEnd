import { Phone, Video, PhoneIncoming, PhoneMissed, Loader2 } from 'lucide-react';
import { useCallHistory } from '../hooks/useCallHistory';

export const CallHistoryPanel = () => {
  const { calls, isLoading } = useCallHistory();

  if (isLoading) {
    return <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" /></div>;
  }

  if (calls.length === 0) {
    return <p className="text-center text-gray-500 text-sm mt-8 px-4">Nenhuma chamada recente</p>;
  }

  return (
    <div className="space-y-2 px-3">
      {calls.map(call => {
        const isMissed = call.status === 'Missed' || call.status === 'NoAnswer';
        const isVideo = call.type === 'Video';

        return (
          <div key={call.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isMissed ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                {isMissed ? <PhoneMissed size={16} /> : <PhoneIncoming size={16} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Chamada #{call.id}</p>
                <p className="text-[10px] text-gray-500">
                  {call.status} • {call.durationSeconds ? `${Math.floor(call.durationSeconds / 60)}min` : '—'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                {isVideo ? <Video size={14} /> : <Phone size={14} />}
                <span className="text-[10px]">{new Date(call.startedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
