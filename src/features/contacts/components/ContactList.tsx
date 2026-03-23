import { useContacts } from '../hooks/useContacts';
import { ContactItem } from './ContactItem';
import { Loader2 } from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';

export const ContactList = () => {
    const { contacts, isLoading } = useContacts();
    const setSelectedContact = useChatStore((state) => state.setSelectedContact);
    const selectedContactId = useChatStore((state) => state.selectedContact?.contactUserId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-10 space-y-2 opacity-50">
                <Loader2 className="animate-spin text-purple-500" size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Sincronizando contatos...
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 p-2 overflow-y-auto h-full bg-[#050505] scrollbar-thin scrollbar-thumb-white/5">
            <div className="flex justify-between items-center px-3 mb-4">
                <h3 className="text-[10px] font-black text-purple-500/60 uppercase tracking-[0.2em]">
                    Contatos Identificados ({contacts.length})
                </h3>
            </div>

            {contacts.length === 0 ? (
                <div className="px-3 py-10 text-center">
                    <p className="text-xs text-gray-600 italic">
                        Sua rede Philo está vazia. <br /> Adicione alguém pelo telefone.
                    </p>
                </div>
            ) : (
                contacts.map(contact => (
                    <ContactItem
                        key={contact.id}
                        contact={contact}
                        isActive={selectedContactId === contact.contactUserId}
                        onSelect={() => {
                            console.log("Selecionando contato para preview:", contact.displayName);
                            setSelectedContact(contact); 
                        }}
                    />
                ))
            )}
        </div>
    );
};