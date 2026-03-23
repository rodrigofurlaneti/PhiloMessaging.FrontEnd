import { useState } from 'react';
import { LoginForm, RegisterForm } from '@/features/auth';

function App() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <main className="w-full h-full flex items-center justify-center p-4">
            {isLogin ? (
                <LoginForm onToggleRegister={() => setIsLogin(false)} />
            ) : (
                <RegisterForm onToggleLogin={() => setIsLogin(true)} />
            )}
        </main>
    );
}

export default App;