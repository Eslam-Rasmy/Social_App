import type { IConversation } from "../../Common/index.js";
import { conversationModel } from "../Modles/conversation.model.js";
import { BaseRepository } from "./base.repository.js";

export class ConversationRepositry extends BaseRepository<IConversation> {
  constructor() {
    super(conversationModel);
  }
}
