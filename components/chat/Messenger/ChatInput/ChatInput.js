import React, { useEffect, useRef, useState } from "react";
import { Picker } from "emoji-mart";
import { useDispatch } from "react-redux";
import {sendMessage} from '../../../../redux/actions/messages';
import { useRouter } from "next/router";

const ChatInput = ({emitMsgSocket}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputVal, setinputVal] = useState('');

  const emojiRef = useRef();
  const smileyfaceRef = useRef();
  const inputRef = useRef();

  const router = useRouter();

  const dispatch = useDispatch();

  const selectEmoji = emoji => {
    const startPosition = inputRef.current.selectionStart;
    const endPosition = inputRef.current.selectionEnd;
    const emojiLength = emoji.native.length;
    const value = inputRef.current.value;
    setinputVal(
      value.substring(0, startPosition) + emoji.native + value.substring(endPosition, value.length)
    );
    inputRef.current.focus();
    inputRef.current.selectionEnd = endPosition + emojiLength;
  };

  const sendMessageReq = async e => {
    e.preventDefault();
    const resDispatch = await dispatch(sendMessage(+router.query.chatId, inputVal, 'text'));
    setinputVal('');
    const list = document.getElementById("sc");
    list.scrollTop = list.scrollHeight - list.clientHeight - 1;
    if (resDispatch.type === "NEW_MESSAGE") {
      emitMsgSocket(resDispatch.message, resDispatch.chat_id.toString());
    }
  };

  useEffect(() => {
    const closeEmoji = evt => {
        if (emojiRef.current && !emojiRef.current.contains(evt.target) && !smileyfaceRef.current.contains(evt.target)) {
            if (showEmojiPicker) {
                setShowEmojiPicker(false);
            }
        }
    };

    document.body.addEventListener('click', closeEmoji);
    return () => {
        document.body.removeEventListener('click', closeEmoji);
    };
  }, [showEmojiPicker]);

  return (
    <form className="chatInput" onSubmit={sendMessageReq}>
      <input
        placeholder="Type Your Message..."
        type="text"
        name="message"
        ref={inputRef}
        value={inputVal}
        onChange={e => setinputVal(e.target.value)}
      />
      <img
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        src="/images/happy.png"
        alt="fsdf"
        className="emojiPi"
        ref={smileyfaceRef}
        width={25}
        height={25}
      />
      {showEmojiPicker && (
          <div className="emojiPic" ref={emojiRef}>
              <Picker
                title="Pick your emoji..."
                emoji="point_up"
                style={{
                  position: "absolute",
                  right: "30px",
                  bottom: "30px",
                }}
                onSelect={selectEmoji}
              />
          </div>
      )}
    </form>
  );
};

export default ChatInput;
