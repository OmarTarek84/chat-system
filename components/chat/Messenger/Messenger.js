import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ChatInput from "./ChatInput/ChatInput";
import Messages from "./Messages/Messages";
import MessengerHead from "./MessengerHead/MessengerHead";
import { useSelector } from "react-redux";
import useSocket from "../../../hooks/useSocket";

const Messenger = () => {
  const router = useRouter();
  const { socket } = useSocket();
  const { email, first_name: firstName, last_name: lastName } = useSelector((state) => state.user);

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const emailSocket = email || localStorage.getItem("email");
    if (router.query.chatId) {
        socket.current.emit("joinRoom", {
          chatId: router.query.chatId,
          email: emailSocket,
          firstName: firstName || localStorage.getItem('firstName'),
          lastName: lastName || localStorage.getItem('lastName'),
        });
        socket.current.on('online', data => {
          const onlineemailUsers = data.map(o => o.email);
          setOnlineUsers(onlineemailUsers);
        });
        socket.current.on('userJoined', data => {
          console.log('userJoined', data);
        });
        socket.current.on('userLeft', data => {
          console.log(data);
        });
    }
    return () => {
      socket.current.emit("leaveRoom", {
        chatId: router.query.chatId ? router.query.chatId: router.asPath.split('=')[1],
        email: emailSocket,
        firstName: firstName || localStorage.getItem('firstName'),
        lastName: lastName || localStorage.getItem('lastName'),
      });
    };
  }, [router.query.chatId]);

  return (
    <div className="messenger">
      <MessengerHead onlineUsers={onlineUsers} />
      <Messages />
      {router.query.chatId && router.query.chatId != null && <ChatInput />}
    </div>
  );
};

export default Messenger;
