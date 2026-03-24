import type { ContactDto } from '../types';

interface ContactItemProps {
    contact: ContactDto;
    onSelect: (contact: ContactDto) => void;
    isActive?: boolean;
}

export const ContactItem = ({ contact, onSelect, isActive }: ContactItemProps) => {
    const initials = contact.displayName.substring(0, 2).toUpperCase();

    return (
        <div
            onClick={() => onSelect(contact)}
            style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 14, marginBottom: 2,
                cursor: 'pointer',
                background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(201,168,76,0.2)' : 'transparent'}`,
                borderLeft: `3px solid ${isActive ? '#C9A84C' : 'transparent'}`,
                transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
                if (!isActive) {
                    e.currentTarget.style.background = 'rgba(201,168,76,0.04)';
                    e.currentTarget.style.borderLeftColor = 'rgba(201,168,76,0.15)';
                }
            }}
            onMouseLeave={e => {
                if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                }
            }}
        >
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
                {contact.avatarUrl ? (
                    <img
                        src={contact.avatarUrl}
                        alt={contact.displayName}
                        onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${contact.displayName}&background=191209&color=C9A84C`; }}
                        style={{
                            width: 40, height: 40, borderRadius: '50%', objectFit: 'cover',
                            border: `1px solid ${isActive ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.12)'}`,
                        }}
                    />
                ) : (
                    <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: isActive ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isActive ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.12)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 500,
                        color: isActive ? '#C9A84C' : 'rgba(201,168,76,0.4)',
                        boxShadow: isActive ? '0 0 12px rgba(201,168,76,0.1)' : 'none',
                        transition: 'all 0.2s',
                    }}>
                        {initials}
                    </div>
                )}

                {/* Blocked indicator */}
                {contact.isBlocked && (
                    <span style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: 10, height: 10, borderRadius: '50%',
                        background: '#c0392b',
                        border: '2px solid #0b0b0b',
                    }}/>
                )}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                    fontSize: 13, fontWeight: 600,
                    color: isActive ? '#E8D5A3' : '#d4cbbf',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    marginBottom: 2, transition: 'color 0.2s',
                }}>
                    {contact.nickname || contact.displayName}
                </h4>
                <p style={{
                    fontSize: 10, fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.06em',
                    color: isActive ? 'rgba(201,168,76,0.45)' : 'rgba(255,255,255,0.2)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {contact.phoneNumber || 'Identidade oculta'}
                </p>
            </div>

            {/* Blocked badge */}
            {contact.isBlocked && (
                <span style={{
                    flexShrink: 0, padding: '2px 8px', borderRadius: 100,
                    fontSize: 8, fontFamily: 'DM Mono, monospace', letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    background: 'rgba(192,57,43,0.12)',
                    border: '1px solid rgba(192,57,43,0.25)',
                    color: '#e07070',
                }}>
                    Bloqueado
                </span>
            )}
        </div>
    );
};
