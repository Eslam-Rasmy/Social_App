import type { Socket } from "socket.io";
import { getIo } from "../../../Gateways/socketIo.gateway.js";
import { MessageRepository } from "../../../DB/Repositorye/message.repository.js";
import { ConversationRepositry } from "../../../DB/Repositorye/conversation.repository.js";

export class ChatService {
  private conversationRepository = new ConversationRepositry();
  private messageRepository = new MessageRepository();

  async joinprivteChat(socket: Socket, targerUserId: string) {
    let convesation = await this.conversationRepository.findonDocoment({
      type: "direct",
      members: { $all: [socket.data.userId, targerUserId] },
    });
    if (!convesation) {
      convesation = await this.conversationRepository.createNewDocoment({
        type: "direct",
        members:  [socket.data.userId, targerUserId] ,
      });
    }
    socket.join(convesation._id!.toString());
    return convesation;
  }
  async sendPrivateMessage(socket: Socket, data: unknown) {
    const { text, targerUserId } = data as {
      text: string;
      targerUserId: string;
    };
    const coversation = await this.joinprivteChat(socket, targerUserId);
    const message = await this.messageRepository.createNewDocoment({
      text,
      conversationId: coversation._id!,
      senderId: socket.data.userId,
    }); 

    getIo()?.to(coversation._id!.toString()).emit("message-sent", message);
  }
}
