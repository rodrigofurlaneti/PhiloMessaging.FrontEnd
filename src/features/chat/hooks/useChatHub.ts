import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from '../context/AuthContext';

export const useChatHub = () => {
    const { user } = useAuth(); // Mantemos o user para monitorar o estado de autenticação
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        // Se não houver usuário ou token, não tentamos conectar
        const token = localStorage.getItem('@PhiloMessaging:token');
        if (!token || !user) return;

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:61799/chatHub", {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        // Cleanup: Desconecta quando o componente for destruído ou o usuário deslogar
        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, [user]); // Adicionamos 'user' aqui para o TS entender que ele é lido para decidir a conexão

    useEffect(() => {
        if (connection && connection.state === signalR.HubConnectionState.Disconnected) {
            connection.start()
                .then(() => {
                    // Agora usamos o 'user' para um log útil, resolvendo o erro TS6133
                    console.log(`Conectado ao Philo Hub como: ${user?.displayName}`);
                })
                .catch(err => console.error('Erro na conexão SignalR: ', err));
        }
    }, [connection, user]);

    return connection;
};