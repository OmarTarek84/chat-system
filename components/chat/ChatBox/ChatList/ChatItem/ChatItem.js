import { useRouter } from "next/router";
import React, { useEffect } from "react";

const ChatItem = ({chat}) => {

  const chatUsers = chat.chatdetails.users.filter(p => p.email !== localStorage.getItem('email'));
  const mappedUsers = chatUsers.map(u => u.full_name);

  const router = useRouter();

  const renderImages = () => {
    const firstUserProfilePic = chatUsers[0] && chatUsers[0].avatar || "/images/profilePic.jpeg"; 
    const secondUserProfilePic = chatUsers[1] && chatUsers[1].avatar ? chatUsers[1].avatar : "/images/profilePic.jpeg"; 
    if (chat.chatdetails.chat_type === 'dual') {
      return (
        <img src={firstUserProfilePic} alt="name" width={40} height={40} />
      )
    } else {
      return (
        <div className="imageGroup">
          <img src={firstUserProfilePic} alt="name" width={30} height={30} />
          <img src={secondUserProfilePic} alt="name" width={30} height={30} />
        </div>
      )
    }
  };

  const changeChat = () => {
    if (router.query.chatId != chat.chatdetails.chat_id) {
      router.replace({
        pathname: '',
        query: {
          chatId: encodeURI(chat.chatdetails.chat_id)
        }
      });
    }
  };
 
  return (
    <div 
      className="friend"
      onClick={changeChat}
      style={{
        backgroundColor: router.query.chatId == chat.chatdetails.chat_id ? 'rgb(225, 222, 230)': 'transparent'
      }}
    >
      <div className="img-details" style={{
        paddingLeft: chat.chatdetails.chat_type === 'dual' ? '0': '40px'
      }}>
        {renderImages()}
        <div className="name-latestMsg">
          <p className="first-last">{mappedUsers.join(', ')}</p>
          <div className="latest">{chat.chatdetails.latest_message ? `${chat.chatdetails.latest_message_from}: ${chat.chatdetails.latest_message}`: 'No Messages Yet!'}</div>
        </div>
      </div>
      {/* <span className="online-offline"></span> */}
    </div>
  );
};

export default ChatItem;
