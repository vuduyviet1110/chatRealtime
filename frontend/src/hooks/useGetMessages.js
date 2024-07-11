import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../zustand/useAuth";
import useConversation from "../zustand/useConversation";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        };
        const res = await fetch(
          `http://localhost:8000/api/conversation/${selectedConversation._id}`,
          {
            method: "GET",
            headers,
          }
        );
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  return { loading, messages };
};
export default useGetMessages;
