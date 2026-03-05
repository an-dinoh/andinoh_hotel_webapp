import { authService } from './auth.service';

type WebSocketAction = 'subscribe_inventory' | 'subscribe_hotel_status' | 'subscribe_chat' | 'subscribe_hotel_reception';

interface WebSocketMessage {
    action: WebSocketAction;
    hotel_id?: string;
    chat_id?: string;
}

interface ServerNotification {
    type: 'booking_update' | 'hotel_status_update' | 'new_chat_message' | 'reception_alert' | 'inventory_updated';
    message: any;
}

class WebSocketService {
    private socket: WebSocket | null = null;
    private baseUrl = 'wss://andinoh-backend.onrender.com/ws/notifications/';
    private listeners: Set<(data: ServerNotification) => void> = new Set();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 20; // Increased to allow more retries over time
    // Queue subscriptions that arrive before the socket is OPEN
    private pendingSubscriptions: Array<{ action: WebSocketAction; id: string }> = [];

    connect() {
        if (this.socket?.readyState === WebSocket.OPEN) return;

        const token = authService.getToken();
        if (!token) {
            console.warn('Cannot connect to WebSocket: No auth token found.');
            return;
        }

        const url = `${this.baseUrl}?token=${token}`;
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            // Flush any subscriptions that were queued before connection opened
            this.pendingSubscriptions.forEach(({ action, id }) => this._send(action, id));
            this.pendingSubscriptions = [];
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Silently drop subscription confirmations — they have no 'type' field
                if (!data.type) return;
                this.listeners.forEach(listener => listener(data as ServerNotification));
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket closed:', event.reason);
            this.handleReconnect();
        };

        this.socket.onerror = () => {
            console.warn('WebSocket connection encountered an error. Will attempt to reconnect.');
        };
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            console.log(`Attempting to reconnect in ${delay}ms... (Attempt ${this.reconnectAttempts})`);
            setTimeout(() => this.connect(), delay);
        } else {
            console.warn('Max WebSocket reconnect attempts reached. Please refresh to re-establish connection.');
        }
    }

    subscribe(action: WebSocketAction, id: string) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this._send(action, id);
        } else {
            // Queue for when connection opens
            this.pendingSubscriptions.push({ action, id });
        }
    }

    private _send(action: WebSocketAction, id: string) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.log(`WebSocket not ready (state: ${this.socket?.readyState}). Queuing ${action} for ${id}`);
            this.pendingSubscriptions.push({ action, id });
            return;
        }

        const payload: WebSocketMessage = { action };
        if (action === 'subscribe_chat') {
            payload.chat_id = id;
        } else {
            payload.hotel_id = id;
        }

        try {
            this.socket.send(JSON.stringify(payload));
        } catch (error) {
            console.error('Failed to send WebSocket message, re-queuing:', error);
            this.pendingSubscriptions.push({ action, id });
        }
    }

    addListener(callback: (data: ServerNotification) => void) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export const webSocketService = new WebSocketService();
