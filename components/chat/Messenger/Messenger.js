import { useRouter } from "next/router";
import React from "react";
import ChatInput from "./ChatInput/ChatInput";
import Messages from "./Messages/Messages";
import MessengerHead from "./MessengerHead/MessengerHead";

const Messenger = ({addUserToChatSocket, deleteChatSocket, onlineUsers, leaveChatSocket, emitMsgSocket}) => {

  const router = useRouter();
  return (
    <div className="messenger">
      <MessengerHead addUserToChatSocket={addUserToChatSocket} deleteChatSocket={deleteChatSocket} onlineUsers={onlineUsers} leaveChatSocket={leaveChatSocket} />
      <Messages />
      {router.query.chatId && router.query.chatId != null && <ChatInput emitMsgSocket={emitMsgSocket} />}
    </div>
  );
};

export default Messenger;
