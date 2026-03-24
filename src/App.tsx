import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './features/chat/context/AuthContext';
import { LoginForm, RegisterForm } from './features/auth';
import { ChatShell } from './features/chat';

/* ─── Decorative Auth Background ────────────────────────────────────── */
const AuthBackground = () => (
    <div className="auth-bg" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid-auth" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(201,168,76,0.045)" strokeWidth="0.5"/>
                </pattern>
                <pattern id="diag-auth" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="80" stroke="rgba(201,168,76,0.022)" strokeWidth="0.5"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-auth)"/>
            <rect width="100%" height="100%" fill="url(#diag-auth)"/>
        </svg>

        {/* Top-left ornament */}
        <svg className="absolute top-8 left-8 w-28 h-28 pointer-events-none opacity-25" viewBox="0 0 112 112" fill="none">
            <path d="M4 4 L56 4 M4 4 L4 56" stroke="#C9A84C" strokeWidth="0.8"/>
            <path d="M14 14 L46 14 M14 14 L14 46" stroke="#C9A84C" strokeWidth="0.4"/>
            <circle cx="4" cy="4" r="2" fill="#C9A84C"/>
        </svg>

        {/* Bottom-right ornament */}
        <svg className="absolute bottom-8 right-8 w-28 h-28 pointer-events-none opacity-25" viewBox="0 0 112 112" fill="none">
            <path d="M108 108 L56 108 M108 108 L108 56" stroke="#C9A84C" strokeWidth="0.8"/>
            <path d="M98 98 L66 98 M98 98 L98 66" stroke="#C9A84C" strokeWidth="0.4"/>
            <circle cx="108" cy="108" r="2" fill="#C9A84C"/>
        </svg>

        {/* Side accent lines */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width:'clamp(80px,12vw,180px)', height:'1px', background:'linear-gradient(90deg, transparent, rgba(201,168,76,0.18), transparent)' }}/>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width:'clamp(80px,12vw,180px)', height:'1px', background:'linear-gradient(270deg, transparent, rgba(201,168,76,0.18), transparent)' }}/>
    </div>
);

const AppContent = () => {
    const { isAuthenticated } = useAuth();
    const [isLogin, setIsLogin] = useState(true);

    if (isAuthenticated) return <ChatShell />;

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
            <AuthBackground />
            <div className="relative z-10 w-full flex items-center justify-center px-4 py-12">
                {isLogin
                    ? <LoginForm    onToggleRegister={() => setIsLogin(false)} />
                    : <RegisterForm onToggleLogin={()    => setIsLogin(true)}  />
                }
            </div>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
                pauseOnHover
                toastStyle={{
                    background: '#111',
                    border: '1px solid rgba(201,168,76,0.15)',
                    color: '#F5EDD8',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '13px',
                }}
            />
            <AppContent />
        </AuthProvider>
    );
}

export default App;