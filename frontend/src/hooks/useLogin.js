import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/Authcontext.jsx";
import useAuthStore from "../zustand/useAuth";

const useLogin = () => {
  const { accessToken, setAccessToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  useEffect(() => {
    console.log("Current accessToken:", accessToken);
  }, [accessToken]);

  const login = async (email, password) => {
    const success = handleInputErrors(email, password);
    if (!success) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Full response:", data);

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Invalid email or password");
        } else if (res.status === 404) {
          toast.error("User not found");
        } else if (data.message === "Wrong password") {
          toast.error("wrong password");
        }
        return;
      }

      if (res.ok) {
        localStorage.setItem("chat-user", JSON.stringify(data));
        setAuthUser(data);
        setAccessToken(data.accessToken);
        console.log("Setting accessToken:", data.accessToken);
        toast.success("Login successful");
      } else {
        console.error("Unexpected response structure:", data);
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;

function handleInputErrors(email, password) {
  if (!email || !password) {
    toast.error("Please fill in all fields");
    return false;
  }
  return true;
}
