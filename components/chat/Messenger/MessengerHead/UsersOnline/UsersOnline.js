import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';

const UsersOnline = () => {

    const {chats} = useSelector(state => state.chat);
    const router = useRouter();

    const chat = chats.find(ch => ch.chatdetails.chat_id == router.query.chatId);

    if (chat) {
      const renderChatUsers = chat.chatdetails.users.map(user => {
        return (
          <div className="username-onlinestatus" key={user.email}>
            <span className="first-lastname">{user.full_name}</span>
            <span className="offline-online"></span>
          </div>
        )
      });
      return renderChatUsers;
    } else {
      return null;
    }

};

export default UsersOnline;