import React from "react";
import ChatInput from "./ChatInput/ChatInput";
import Messages from "./Messages/Messages";
import MessengerHead from "./MessengerHead/MessengerHead";

const Messenger = () => {

  const sendMessage = formData => {
    console.log(formData);
  };

  return (
    <div className="messenger">
        <MessengerHead />
        <Messages />
        <ChatInput sendMessage={sendMessage} />
    </div>
  );
};

export default Messenger;
