import { useRouter } from "next/router";
import React from "react";
import ChatInput from "./ChatInput/ChatInput";
import Messages from "./Messages/Messages";
import MessengerHead from "./MessengerHead/MessengerHead";

const Messenger = () => {

  const router = useRouter();

  return (
    <div className="messenger">
        <MessengerHead />
        <Messages />
        {router.query.chatId && router.query.chatId != null && <ChatInput />}
    </div>
  );
};

export default Messenger;
