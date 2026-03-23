import type { ContactDto } from '../types';

interface ContactItemProps {
    contact: ContactDto;
    onSelect: (contact: ContactDto) => void; // Alterado para passar o objeto completo para facilitar o preview
    isActive?: boolean; // Prop para destacar o contato selecionado na lista
}

export const ContactItem = ({ contact, onSelect, isActive }: ContactItemProps) => {
    return (
        <div
            onClick={() => onSelect(contact)}
            className={`
                flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 rounded-2xl group mx-1
                ${isActive
                    ? 'bg-purple-500/20 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                    : 'bg-transparent border-transparent hover:bg-purple-500/10 hover:border-purple-500/20'
                } 
                border
            `}
        >
            <div className="relative">
                {/* Fallback de Avatar: se não houver imagem, mostramos as iniciais */}
                {contact.avatarUrl ? (
                    <img
                        src={contact.avatarUrl}
                        alt={contact.displayName}
                        className={`
                            w-12 h-12 rounded-full object-cover border transition-colors
                            ${isActive ? 'border-purple-500' : 'border-white/10 group-hover:border-purple-500/50'}
                        `}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${contact.displayName}&background=a855f7&color=fff`;
                        }}
                    />
                ) : (
                    <div className={`
                        w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black border flex items-center justify-center font-bold transition-colors
                        ${isActive ? 'border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-white/10 text-purple-500 group-hover:border-purple-500/50'}
                    `}>
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
                    <h4 className={`
                        text-sm font-bold truncate transition-colors
                        ${isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'}
                    `}>
                        {contact.nickname || contact.displayName}
                    </h4>
                </div>
                <p className={`
                    text-[11px] font-medium truncate tracking-tight
                    ${isActive ? 'text-purple-300' : 'text-gray-500'}
                `}>
                    {contact.phoneNumber || 'Identidade Oculta'}
                </p>
            </div>
        </div>
    );
};