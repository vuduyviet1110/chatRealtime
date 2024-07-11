import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../zustand/useAuth";
const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const { accessToken } = useAuthStore();
  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        console.log(accessToken);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        };
        const res = await fetch("http://localhost:8000/api/users", {
          method: "GET",
          headers,
        });
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};
export default useGetConversations;
