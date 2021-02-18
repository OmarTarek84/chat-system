import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../../../redux/actions/messages";
import MessageList from "./MessageList/MessageList";

const Messages = () => {

    const router = useRouter();
    const {currentPage, pages} = useSelector(state => state.message);

    const dispatch = useDispatch();

  const msgsScroll = () => {
    const list = document.getElementById("sc");
    if (list.scrollTop === 0 && currentPage + 1 <= pages) {
      dispatch(
        fetchMessages(
          currentPage + 1,
          20,
          +router.query.chatId
        )
      ).then(() => {
        list.scrollTop = (list.scrollHeight - list.clientHeight) / 2;
      });
    }
  };

  return (
    <div className="messagesParent" id="sc" onScroll={msgsScroll}>
      <MessageList />
    </div>
  );
};

export default Messages;
