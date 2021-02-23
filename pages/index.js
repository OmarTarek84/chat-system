import ChatBox from "../components/chat/ChatBox/ChatBox";
import Messenger from "../components/chat/Messenger/Messenger";
import BaseLayout from "../layouts/BaseLayout";
import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";
import { ADD_CHAT, ADD_USERS_TO_CHAT, DELETE_CHAT, NEW_MESSAGE, USER_LEAVE_CHAT } from "../redux/actions/actionTypes";
import { useEffect, useRef, useState } from "react";
import socketIOClient from 'socket.io-client';


export default function Home() {
  console.log('HOMEPAGE RENDERED');

  const router = useRouter();
  const { email, first_name: firstName, last_name: lastName } = useSelector((state) => state.user);
  const { chats } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  
  useEffect(() => {
    const storedFirstName = firstName || localStorage.getItem('firstName');
    const storedLastName = lastName || localStorage.getItem('lastName');
    const emailSocket = email || localStorage.getItem("email");
    socket.current = socketIOClient('/', {
      transports: ["websocket"],
    });
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
          dispatch({
            type: NEW_MESSAGE,
            message: {
              message_id: new Date().toISOString(),
              message: data.message,
              chat_id: +data.chatId,
              first_name: null,
              type: 'adminMsg',
              last_name: null,
              gender: "Male",
              avatar: null,
              email: data.email,
            }
          });
        });

        socket.current.on('userLeft', data => {
          console.log('userLEFT', data);
          dispatch({
            type: NEW_MESSAGE,
            message: {
              message_id: new Date().toISOString(),
              message: data.message,
              chat_id: +data.chatId,
              first_name: null,
              type: 'adminMsg',
              last_name: null,
              gender: "Male",
              avatar: null,
              email: data.email,
            }
          });
        });

        socket.current.on('messageToClients', async data => {
          console.log('messageToClients', data);
          await dispatch({
            type: NEW_MESSAGE,
            message: data,
            chat_id: data.chat_id,
            latest_message_from: data.first_name
          });
          const list = document.getElementById("sc");
          list.scrollTop = list.scrollHeight - list.clientHeight - 1;      
        });

        socket.current.on('leavechat', async data => {
          console.log('leavechat', data);
          dispatch({
            type: USER_LEAVE_CHAT,
            chatId: +data.chatId,
            email: data.email
          });
          await dispatch({
            type: NEW_MESSAGE,
            message: {
              message_id: new Date().toISOString(),
              message: `${data.firstName} ${data.lastName} has left the chat`,
              chat_id: +data.chatId,
              first_name: null,
              type: "adminMsg",
              last_name: null,
              gender: "Male",
              avatar: null,
              email: null,
            },
            chat_id: +data.chatId,
          });
        });

        socket.current.on('addUserstochat', async data => {
            await dispatch({
              type: NEW_MESSAGE,
              message: {
                message_id: new Date().toISOString(),
                message: `${data.firstName} ${data.lastName} added ${data.fullNamesUsers.join(', ')} to the chat`,
                chat_id: +data.chatId,
                first_name: null,
                type: "adminMsg",
                last_name: null,
                gender: "Male",
                avatar: null,
                email: null,
              },
              chat_id: +data.chatId,
            });
            dispatch({
              type: ADD_USERS_TO_CHAT,
              chatId: +data.chatId,
              addedUsers: data.addedUsers
            });
        });

        socket.current.on('deleteChat', data => {
          console.log('DELTE CHAT', data);
          dispatch({
            type: DELETE_CHAT,
            chat_id: +data.chatId
          });
          const beforeChatExist = chats[chats.length - 2] && chats[chats.length - 2].chatdetails.chat_id;
          router.replace({
            pathname: '',
            query: {
              chatId: beforeChatExist ?
                        encodeURI(chats[chats.length - 2].chatdetails.chat_id):
                          chats[0] ? chats[0].chatdetails.chat_id: undefined
            }
          });
        });

        socket.current.on('newChat', data => {
          dispatch({
            type: ADD_CHAT,
            chat: data
          });
        });
    }
    return () => {
      socket.current.emit("leaveRoom", {
        chatId: router.query.chatId ? router.query.chatId: router.asPath.split('=')[1],
        email: emailSocket,
        firstName: storedFirstName,
        lastName: storedLastName,
      });
      socket.current.close();
    };
  }, [router.query.chatId]);

  const emitMsgSocket = (message, chatId) => {
    socket.current.emit('newMessage', {
      message: message,
      chatId: chatId
    });
  };

  const leaveChatSocket = chatId => {
    socket.current.emit('leaveChat', {
      chatId: chatId.toString(),
      firstName: firstName,
      lastName: lastName,
      email: email
    });
  };

  const addUserToChatSocket = (chatId, addedUsers) => {
    socket.current.emit('adduserstochat', {
      chatId: chatId.toString(),
      firstName: firstName,
      lastName: lastName,
      addedUsers: addedUsers
    });
  };

  const deleteChatSocket = chatId => {
    socket.current.emit('deletechat', {
      chatId: chatId.toString()
    });
  };

  const addChatSocket = chat => {
    socket.current.emit('addchat', {chat: chat, prevChatId: router.query.chatId});
  };

  return (
    <BaseLayout title="Homepage">
      <div className="Home">
        <ChatBox addChatSocket={addChatSocket} />
        <Messenger addUserToChatSocket={addUserToChatSocket} onlineUsers={onlineUsers} emitMsgSocket={emitMsgSocket} deleteChatSocket={deleteChatSocket} onlineUsers={onlineUsers} leaveChatSocket={leaveChatSocket} />
      </div>
    </BaseLayout>
  );
}
