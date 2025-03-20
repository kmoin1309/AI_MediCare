import { API_BASE_URL } from '../config/api';

class WebSocketService {
  private ws: WebSocket | null = null;
  private shouldReconnect = true;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 3;

  connect(token: string): void {
    try {
      this.ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}?token=${token}`);
      
      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => this.connect(token), 3000);
        }
      };

      this.ws.onerror = () => {
        console.log('WebSocket connection failed');
        this.shouldReconnect = false;
        this.ws?.close();
      };
    } catch (error) {
      console.log('WebSocket initialization failed');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.shouldReconnect = false;
      this.ws.close();
    }
  }
}

export const wsService = new WebSocketService();
