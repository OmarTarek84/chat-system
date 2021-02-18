import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChats } from "../../../redux/actions/chat";
import ChatList from "./ChatList/ChatList";

const ChatBox = () => {

  const {chats, chatLoading, chatError} = useSelector(state => state.chat);
  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {

    const fetDis = async () => {
      const resultDispatch = await dispatch(fetchChats());
      if (resultDispatch && resultDispatch.chats && resultDispatch.type === "FETCH_CHATS_SUCCESS") {
        if (resultDispatch.chats.length > 0) {
          const queryValue = router.asPath.split('=')[router.asPath.split('=').length - 1];
          router.replace({
            pathname: '',
            query: {
              chatId: encodeURI(+queryValue || resultDispatch.chats[0].chatdetails.chat_id)
            }
          });
        }
      }
    };
    fetDis();

  }, [dispatch]);

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
