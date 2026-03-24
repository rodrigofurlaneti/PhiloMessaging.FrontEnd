import { useContacts } from '../hooks/useContacts';
import { ContactItem } from './ContactItem';
import { Loader2, Users } from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';

export const ContactList = () => {
    const { contacts, isLoading } = useContacts();
    const setSelectedContact = useChatStore(state => state.setSelectedContact);
    const selectedContactId  = useChatStore(state => state.selectedContact?.contactUserId);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px', gap: 12 }}>
                <Loader2 size={20} className="animate-spin" style={{ color: '#C9A84C' }}/>
                <span className="font-mono-dm" style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.3)' }}>
                    Sincronizando
                </span>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Section label */}
            <div style={{ padding: '0 12px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.07)' }}/>
                <span className="font-mono-dm" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.3)' }}>
                    {contacts.length} contatos
                </span>
                <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.07)' }}/>
            </div>

            {contacts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 24px' }}>
                    <Users size={28} style={{ color: 'rgba(201,168,76,0.1)', margin: '0 auto 12px' }}/>
                    <p className="font-mono-dm" style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.2)', lineHeight: 1.8 }}>
                        Rede vazia<br/>
                        <span style={{ opacity: 0.7 }}>Adicione alguém pelo telefone</span>
                    </p>
                </div>
            ) : (
                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {contacts.map((contact, i) => (
                        <div key={contact.id} className="animate-slide-r" style={{ animationDelay: `${i * 0.04}s` }}>
                            <ContactItem
                                contact={contact}
                                isActive={selectedContactId === contact.contactUserId}
                                onSelect={() => setSelectedContact(contact)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
