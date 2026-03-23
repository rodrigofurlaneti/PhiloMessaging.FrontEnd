import type { ContactDto } from '../types';

interface ContactItemProps {
    contact: ContactDto;
    onSelect: (id: number) => void;
}

export const ContactItem = ({ contact, onSelect }: ContactItemProps) => {
    return (
        <div
            onClick={() => onSelect(contact.contactUserId)}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20 transition-all duration-200 rounded-2xl group mx-1"
        >
            <div className="relative">
                {/* Fallback de Avatar: se não houver imagem, mostramos as iniciais */}
                {contact.avatarUrl ? (
                    <img
                        src={contact.avatarUrl}
                        alt={contact.displayName}
                        className="w-12 h-12 rounded-full object-cover border border-white/10 group-hover:border-purple-500/50 transition-colors"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + contact.displayName; }}
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center font-bold text-purple-500 group-hover:border-purple-500/50 transition-colors">
                        {contact.displayName.substring(0, 2).toUpperCase()}
                    </div>
                )}

                {/* Indicador de bloqueio com efeito de brilho se estiver bloqueado */}
                {contact.isBlocked && (
                    <span className="absolute bottom-0 right-0 bg-red-500 w-3 h-3 rounded-full border-2 border-[#050505] shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors">
                        {contact.nickname || contact.displayName}
                    </h4>
                </div>
                <p className="text-[11px] text-gray-500 font-medium truncate tracking-tight">
                    {contact.phoneNumber || 'Identidade Oculta'}
                </p>
            </div>
        </div>
    );
};