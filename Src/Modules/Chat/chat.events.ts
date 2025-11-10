import type { Socket } from "socket.io";
import { ChatService } from "./Service/chat.service.js";

export class ChatEvents {
  private chatService: ChatService = new ChatService();
  constructor(private socket: Socket) {}

  sendPrivateMessageEvent() {
    this.socket.on("send-private-message", (data) => {
      this.chatService.sendPrivateMessage(this.socket, data);
    });
  }
}
