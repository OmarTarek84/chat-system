import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatBox from "../components/chat/ChatBox/ChatBox";
import Messenger from "../components/chat/Messenger/Messenger";
import BaseLayout from "../layouts/BaseLayout";
import { fetchChats } from "../redux/actions/chat";

export default function Home() {

  const {chats, chatLoading, chatError} = useSelector(state => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchChats());
  }, []);

  return (
    <BaseLayout title="Homepage">
      <div className="Home">
        <ChatBox chats={chats} chatLoading={chatLoading} />
        <Messenger />
      </div>
    </BaseLayout>
  );
}
