import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importações usando o padrão de Feature (Barril)
import { AuthProvider, useAuth } from './features/chat/context/AuthContext';
import { LoginForm, RegisterForm } from './features/auth';
import { ChatShell } from './features/chat'; 

const AppContent = () => {
    const { isAuthenticated } = useAuth();
    const [isLogin, setIsLogin] = useState(true);

    if (isAuthenticated) {
        return <ChatShell />;
    }

    return (
        <main className="w-full h-screen flex items-center justify-center bg-[#050505]">
            {isLogin ? (
                <LoginForm onToggleRegister={() => setIsLogin(false)} />
            ) : (
                <RegisterForm onToggleLogin={() => setIsLogin(true)} />
            )}
        </main>
    );
};

function App() {
    return (
        <AuthProvider>
            {/* O ToastContainer deve ficar no topo para funcionar em todo o app */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
                pauseOnHover
            />
            <AppContent />
        </AuthProvider>
    );
}

export default App;