import React from "react";
import ChatInput from "./ChatInput/ChatInput";
import Messages from "./Messages/Messages";
import MessengerHead from "./MessengerHead/MessengerHead";

const Messenger = () => {

  return (
    <div className="messenger">
        <MessengerHead />
        <Messages />
        <ChatInput />
    </div>
  );
};

export default Messenger;
