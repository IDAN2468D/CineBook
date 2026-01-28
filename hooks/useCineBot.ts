import { useState } from 'react';
import api from '../constants/api';

export interface ChatMessage {
    id: string;
    role: 'user' | 'bot';
    text: string;
}

export function useCineBot() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'bot', text: 'Hello! I am CineBot 🤖. How can I help you pick a movie today?' }
    ]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
        setMessages(prev => [...prev, newUserMsg]);
        setLoading(true);

        try {
            // Send history context
            const history = messages.map(m => ({ role: m.role, text: m.text }));

            const response = await api.post('ai/chat', { message: text, history });

            const newBotMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                text: response.data.reply
            };
            setMessages(prev => [...prev, newBotMsg]);
        } catch (error) {
            console.error('CineBot Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'bot',
                text: 'Oops! My circuits differ. Try again later. 🔌'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return { messages, loading, sendMessage };
}
