import { useEffect } from "react";
import { UsesocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

function useListenMessage() {
  const { socket } = UsesocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages([...messages, data]);
    };

    if (socket) {
      socket.on("newMessage", handleMessage);

      return () => socket.off("newMessage", handleMessage);
    }
  }, [socket, setMessages, messages]);
}

export default useListenMessage;
