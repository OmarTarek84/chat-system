import React from "react";
import ChatList from "./ChatList/ChatList";

const ChatBox = ({chats, chatLoading}) => {
  return (
    <div className="ChatBox">
      <div className="head">
        <h3>Chats</h3>
        <button>Add</button>
      </div>
      <ChatList chats={chats} chatLoading={chatLoading} />
    </div>
  );
};

export default ChatBox;
