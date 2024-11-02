import { useCallback, useMemo } from 'react';
import io from 'socket.io-client';

type Params = {
    url: string;
}

type OnMessageFunction<Type> = (message: Type) => void;

export default function useSocketIo<MessageType>({ url }: Params){

    const socket = useMemo(() => io(url) , [url]);

    function send(data: MessageType){
        try {
            socket.send(JSON.stringify(data));
        } catch {
            console.error("Erro ao enviar dados");
        }
    }
    
    const onMessage = useCallback((func: OnMessageFunction<MessageType>) => {
        try {
            socket.on('message', (message) => func(JSON.parse(message)));
        } catch {
            console.error("Erro ao receber mensagem");
        }
    }, [socket])

    return {
        send,
        onMessage
    }
}