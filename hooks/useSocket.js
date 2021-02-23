import { useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";

const useSocket = () => {
  const socket = useRef();
  useEffect(() => {
    socket.current = socketIOClient('/', {
      transports: ["websocket"],
    });
    return () => {
      socket.current.disconnect();
    };
  }, []);

  return { socket };
};

export default useSocket;
