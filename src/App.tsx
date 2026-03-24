import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './features/chat/context/AuthContext';
import { LoginForm, RegisterForm } from './features/auth';
import { ChatShell } from './features/chat';
import { ShieldCheck, Lock, Zap, Globe } from 'lucide-react';

// ── Painel Visual Direito ─────────────────────────────────────────────────────
const BrandingPanel = () => {
  const mockMessages = [
    { id: 1, text: 'Mensagem criptografada ponta a ponta 🔒', mine: false, delay: '0s' },
    { id: 2, text: 'Seus dados são só seus.', mine: true, delay: '0.4s' },
    { id: 3, text: 'Conexão segura estabelecida ✓', mine: false, delay: '0.8s' },
    { id: 4, text: 'PhiloMessaging — Portal Seguro', mine: true, delay: '1.2s' },
  ];

  const features = [
    { icon: ShieldCheck, label: 'E2E Cifrado', color: 'text-emerald-400' },
    { icon: Lock,        label: 'Privacidade Total', color: 'text-cyan-400' },
    { icon: Zap,         label: 'Tempo Real', color: 'text-yellow-400' },
    { icon: Globe,       label: 'Multi-idioma', color: 'text-purple-400' },
  ];

  return (
    <div className="hidden lg:flex w-[58%] relative overflow-hidden bg-[#060e0a]">
      {/* Glow de fundo */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Grid sutil */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-16 gap-12">

        {/* Título grande decorativo */}
        <div className="text-center select-none">
          <p className="text-[10px] font-black tracking-[0.5em] text-emerald-500/40 uppercase mb-4">
            Plataforma de Mensagens
          </p>
          <h2 className="text-5xl xl:text-6xl font-black leading-[1.1] tracking-tighter">
            <span className="text-white/10">COMUNIQUE</span>
            <br />
            <span className="text-emerald-500/25">COM</span>
            <br />
            <span className="text-white/10">PRIVACIDADE</span>
          </h2>
        </div>

        {/* Mock de Chat animado */}
        <div className="w-full max-w-sm bg-white/[0.03] border border-white/5 rounded-3xl p-5 backdrop-blur-sm">
          {/* Header mock */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-emerald-400 text-xs font-black">P</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white/60">PhiloSecure</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[9px] text-emerald-400/70">Online · Cifrado</span>
              </div>
            </div>
            <div className="ml-auto">
              <ShieldCheck size={14} className="text-emerald-500/50" />
            </div>
          </div>

          {/* Mensagens */}
          <div className="space-y-3">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}
                style={{
                  animation: `fadeSlideIn 0.5s ease both`,
                  animationDelay: msg.delay,
                }}
              >
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-[11px] font-medium ${
                  msg.mine
                    ? 'bg-emerald-500/20 border border-emerald-500/25 text-emerald-100 rounded-tr-none'
                    : 'bg-white/5 border border-white/8 text-gray-400 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Barra de input mock */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
            <div className="flex-1 h-7 bg-white/5 rounded-full border border-white/5" />
            <div className="w-7 h-7 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-400/60 rounded-sm rotate-45" />
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {features.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2.5 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
              <Icon size={14} className={color} />
              <span className="text-[11px] font-semibold text-gray-500">{label}</span>
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <p className="text-[9px] text-gray-700 tracking-widest uppercase">
          © 2026 PhiloMessaging · Todos os direitos reservados
        </p>
      </div>

      {/* Keyframes via style tag */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
};

// ── App ───────────────────────────────────────────────────────────────────────
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (isAuthenticated) {
    return <ChatShell />;
  }

  return (
    <main className="w-full h-screen flex overflow-hidden bg-[#050505]">
      {/* Painel esquerdo — formulário */}
      <div className="w-full lg:w-[42%] flex flex-col items-center justify-center p-8 overflow-y-auto relative bg-[#070d09]">
        {/* Linha decorativa lateral direita */}
        <div className="hidden lg:block absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />

        {isLogin ? (
          <LoginForm onToggleRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleLogin={() => setIsLogin(true)} />
        )}
      </div>

      {/* Painel direito — visual */}
      <BrandingPanel />
    </main>
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
      />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
