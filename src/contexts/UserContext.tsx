import React, { createContext, useState, useEffect } from "react";
import { User, UserContextProps } from "../types/user";

// Default user state (logged-out)
const defaultUser = {
  accessToken: null,
  userName: null,
  avatarUrl: null,
};

// Create context with default values
export const UserContext = createContext<UserContextProps>({
  user: defaultUser,
  setUser: () => {},
});

// Provider component to manage and share user state. load user state from localStorage if present
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>({
    accessToken: localStorage.getItem("accessToken"),
    userName: localStorage.getItem("userName"),
    avatarUrl: localStorage.getItem("avatarUrl"),
  });

  // Sync user state with localStorage on change
  useEffect(() => {
    if (user.accessToken) {
      localStorage.setItem("accessToken", user.accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }

    if (user.userName) {
      localStorage.setItem("userName", user.userName);
    } else {
      localStorage.removeItem("userName");
    }

    if (user.avatarUrl) {
      localStorage.setItem("avatarUrl", user.avatarUrl);
    } else {
      localStorage.removeItem("avatarUrl");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
