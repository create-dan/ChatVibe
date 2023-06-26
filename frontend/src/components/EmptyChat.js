import React from "react";
import Lottie from "react-lottie";
import empty from "../animations/empty.json";

const EmptyChat = ({ chats }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: empty,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      {chats && chats.length == 0 && (
        <div>
          <Lottie options={defaultOptions} />
          <h1>No chats available. Search the user and start the chat.</h1>
        </div>
      )}
    </div>
  );
};

export default EmptyChat;
