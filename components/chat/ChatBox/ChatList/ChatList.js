import React from "react";
import ChatItem from "./ChatItem/ChatItem";

const ChatList = ({ chats, chatLoading }) => {

    const renderChats = chats.map((chat, index) => {
        return <ChatItem key={index} chat={chat} />
    });

  return (
    <div className="friends">
        {renderChats}
    </div>
  );
};

export default ChatList;
