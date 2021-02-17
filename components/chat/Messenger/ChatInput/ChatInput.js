import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Picker } from "emoji-mart";

const ChatInput = ({ sendMessage }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: { message: "" },
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef();
  const smileyfaceRef = useRef();

  const selectEmoji = emoji => {
    console.log(emoji);
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
    <form className="chatInput" onSubmit={handleSubmit(sendMessage)}>
      <input
        placeholder="Type Your Message..."
        type="text"
        name="message"
        ref={register({ required: true })}
      />
      <img
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        src="/images/happy.png"
        alt="fsdf"
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
