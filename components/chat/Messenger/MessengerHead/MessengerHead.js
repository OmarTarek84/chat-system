import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChat, leaveChat } from "../../../../redux/actions/chat";
import AddUsersModal from "../../../AddUsersModal/AddUsersModal";
import UsersOnline from "./UsersOnline/UsersOnline";

const MessengerHead = ({onlineUsers}) => {
  const [openChatActionsBox, setopenChatActionsBox] = useState(false);
  const [addUsersModal, setaddUsersModal] = useState(false);

  const {chats} = useSelector(state => state.chat);
  const {email} = useSelector(state => state.user);

  const dispatch = useDispatch();

  const router = useRouter();

  const currentChat = chats.find(chat => chat.chatdetails.chat_id == router.query.chatId);

  const boxMenuRef = useRef();

  useEffect(() => {
    const closeChatBoxOnClick = (evt) => {
      if (boxMenuRef.current && !boxMenuRef.current.contains(evt.target)) {
          if (openChatActionsBox) {
              setopenChatActionsBox(false);
          }
      }
    };
    document.body.addEventListener("click", closeChatBoxOnClick);
    return () => {
      document.body.removeEventListener("click", closeChatBoxOnClick);
    };
  }, [openChatActionsBox]);

  const deleteChatReq = () => {
    dispatch(deleteChat(router.query.chatId)).then(() => {
        setopenChatActionsBox(false);
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
  };

  const leaveChatReq = async() => {
    const resDispatch = await dispatch(leaveChat(router.query.chatId));
    if (resDispatch.type === 'LEAVE_CHAT') {
      setopenChatActionsBox(false);
      const beforeChatExist = chats[chats.length - 2] && chats[chats.length - 2].chatdetails.chat_id;
      router.replace({
        pathname: '',
        query: {
          chatId: beforeChatExist ?
                    encodeURI(chats[chats.length - 2].chatdetails.chat_id):
                      chats[0] ? chats[0].chatdetails.chat_id: undefined
        }
      });
    }
  };

  return (
    <>
    <div className="head">
      <div className="onlineusers">
        <UsersOnline onlineUsers={onlineUsers} />
      </div>
      <div className="chatActions" style={{
        display: router.query.chatId && router.query.chatId != null ? 'block': 'none'
      }}>
        <button
          className="btn-openselect"
          onClick={() => setopenChatActionsBox(!openChatActionsBox)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        {openChatActionsBox && (
          <div className="actionsBoxMenu" ref={boxMenuRef}>
            <div className="menus-select">
              <button onClick={() => setaddUsersModal(true)}>
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <defs></defs>
                  <title />
                  <g data-name="Layer 26" id="Layer_26">
                    <path
                      className="cls-1"
                      d="M14,25.18a5,5,0,0,1-5-5V18.36a1,1,0,0,1,.49-.86l3.63-2.18a1,1,0,0,1,1,1.72L11,18.93v1.25a3,3,0,0,0,3,3,1,1,0,0,1,0,2Z"
                    />
                    <path
                      className="cls-1"
                      d="M7,25.18H6a5,5,0,0,1-5-5V18.36a1,1,0,0,1,.49-.86l3.63-2.18a1,1,0,0,1,1,1.72L3,18.93v1.25a3,3,0,0,0,3,3H7a1,1,0,0,1,0,2Z"
                    />
                    <path
                      className="cls-1"
                      d="M10,15A6,6,0,0,1,10,3a1,1,0,0,1,0,2,4,4,0,0,0,0,8,1,1,0,0,1,0,2Z"
                    />
                    <path
                      className="cls-1"
                      d="M18,15a6,6,0,1,1,6-6A6,6,0,0,1,18,15ZM18,5a4,4,0,1,0,4,4A4,4,0,0,0,18,5Z"
                    />
                    <path
                      className="cls-1"
                      d="M24,29a7,7,0,1,1,7-7A7,7,0,0,1,24,29Zm0-12a5,5,0,1,0,5,5A5,5,0,0,0,24,17Z"
                    />
                    <rect
                      className="cls-1"
                      height="2"
                      width="6"
                      x="21"
                      y="21"
                    />
                    <rect
                      className="cls-1"
                      height="6"
                      width="2"
                      x="23"
                      y="19"
                    />
                  </g>
                </svg>
                <span>Add User To Chat</span>
              </button>
              <button onClick={leaveChatReq} style={{
                display: currentChat && currentChat.chatdetails && currentChat.chatdetails.created_by === email ? 'none': 'flex'
              }}>
                <svg
                  height="48"
                  id="svg8"
                  version="1.1"
                  viewBox="0 0 12.7 12.7"
                  width="48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="layer1" transform="translate(0,-284.3)">
                    <path
                      d="M 7.0555553,285.71111 H 2.1166666 v 9.87779 h 4.938889 v -0.70557 H 2.8222222 v -8.46667 h 4.2333334 z"
                      id="path12"
                    />
                    <path
                      d="M 4.2333334,289.94445 H 9.172222 l -2.1166667,-2.11667 0.7055557,-0.70555 3.527778,3.52776 -3.527778,3.52779 -0.7055554,-0.70555 2.1166666,-2.11666 H 4.2333334 Z"
                      id="path822"
                    />
                  </g>
                </svg>
                <span>Leave Chat</span>
              </button>
              <button 
                style={{
                  display: currentChat && currentChat.chatdetails && currentChat.chatdetails.created_by === email ? 'flex': 'none'
                }}
                onClick={deleteChatReq}>
                <svg id="Layer_1" version="1.1" viewBox="0 0 64 64">
                  <g>
                    <g
                      id="Icon-Trash"
                      transform="translate(232.000000, 228.000000)"
                    >
                      <polygon
                        className="st0"
                        id="Fill-6"
                        points="-207.5,-205.1 -204.5,-205.1 -204.5,-181.1 -207.5,-181.1    "
                      />
                      <polygon
                        className="st0"
                        id="Fill-7"
                        points="-201.5,-205.1 -198.5,-205.1 -198.5,-181.1 -201.5,-181.1    "
                      />
                      <polygon
                        className="st0"
                        id="Fill-8"
                        points="-195.5,-205.1 -192.5,-205.1 -192.5,-181.1 -195.5,-181.1    "
                      />
                      <polygon
                        className="st0"
                        id="Fill-9"
                        points="-219.5,-214.1 -180.5,-214.1 -180.5,-211.1 -219.5,-211.1    "
                      />
                      <path
                        className="st0"
                        d="M-192.6-212.6h-2.8v-3c0-0.9-0.7-1.6-1.6-1.6h-6c-0.9,0-1.6,0.7-1.6,1.6v3h-2.8v-3     c0-2.4,2-4.4,4.4-4.4h6c2.4,0,4.4,2,4.4,4.4V-212.6"
                        id="Fill-10"
                      />
                      <path
                        className="st0"
                        d="M-191-172.1h-18c-2.4,0-4.5-2-4.7-4.4l-2.8-36l3-0.2l2.8,36c0.1,0.9,0.9,1.6,1.7,1.6h18     c0.9,0,1.7-0.8,1.7-1.6l2.8-36l3,0.2l-2.8,36C-186.5-174-188.6-172.1-191-172.1"
                        id="Fill-11"
                      />
                    </g>
                  </g>
                </svg>
                <span>Delete Chat</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    {addUsersModal && <AddUsersModal addNewChat={false} chatId={router.query.chatId} closeModal={() => setaddUsersModal(false)} />}
    </>
  );
};

export default MessengerHead;
