import { apiClient } from '@/utils/api';

export interface ChatConversation {
    id: string;
    customer_name: string;
    room_number: string;
    unread_count: number;
    last_message: string;
    last_message_at: string;
    assigned_staff_name: string | null;
    status: 'active' | 'closed' | 'archived';
}

export interface ChatMessage {
    id: string;
    chat_id: string;
    sender_type: 'customer' | 'staff';
    sender_name: string;
    message: string;
    created_at: string;
}

export interface PaginatedChatResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

class ChatService {
    /** List all conversations, optionally filtered by status */
    async getConversations(status: 'active' | 'closed' | 'archived' = 'active'): Promise<PaginatedChatResponse<ChatConversation>> {
        return apiClient.get<PaginatedChatResponse<ChatConversation>>(`hotels/chats/?status=${status}`);
    }

    /** Get all messages for a chat (auto-marks customer messages as read) */
    async getMessages(chatId: string): Promise<PaginatedChatResponse<ChatMessage>> {
        return apiClient.get<PaginatedChatResponse<ChatMessage>>(`hotels/chats/${chatId}/messages/`);
    }

    /** Send a staff reply */
    async sendMessage(chatId: string, message: string): Promise<ChatMessage> {
        return apiClient.post<ChatMessage>(`hotels/chats/${chatId}/messages/`, { message });
    }

    /** Close a chat */
    async closeChat(chatId: string): Promise<void> {
        return apiClient.post<void>(`hotels/chats/${chatId}/close/`, {});
    }

    /** Assign chat to a staff member */
    async assignChat(chatId: string, staffId: string): Promise<void> {
        return apiClient.post<void>(`hotels/chats/${chatId}/assign/`, { staff_id: staffId });
    }
}

export const chatService = new ChatService();
