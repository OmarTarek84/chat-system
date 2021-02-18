import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../../../../redux/actions/messages";
import MessageItem from "./MessageItem/MessageItem";

const MessageList = () => {
  const dispatch = useDispatch();
  const { messages, messagesError } = useSelector((state) => state.message);
  const router = useRouter();

  const renderMessages = messages.map((message) => {
    return <MessageItem message={message} key={message.message_id} />;
  });

  useEffect(() => {
    if (router.query.chatId) {
      dispatch(fetchMessages(1, 20, +router.query.chatId)).then(() => {
        const list = document.getElementById("sc");
        list.scrollTop = list.scrollHeight - list.clientHeight - 1;
      });
    }
  }, [dispatch, router.query.chatId]);

  return (
    <div className="messages">
      {messagesError ? (
        <span className="fetcherrormsg">{messagesError}</span>
      ) : messages.length > 0 ? (
        renderMessages
      ) : (
        <h3 className="nomessage">No messages yet!</h3>
      )}
    </div>
  );
};

export default MessageList;
