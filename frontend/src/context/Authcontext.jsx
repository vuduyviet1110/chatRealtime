import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  const processAndSetAuthUser = (userData) => {
    if (userData && userData.accessToken) {
      try {
        const decodedToken = jwtDecode(userData.accessToken);
        const { _id, fullName } = decodedToken;
        setAuthUser({ _id, fullName });
      } catch (error) {
        console.error("Error decoding token:", error);
        setAuthUser(null);
      }
    } else {
      setAuthUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ authUser, setAuthUser: processAndSetAuthUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
