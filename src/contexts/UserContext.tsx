import React, { createContext, useState, useEffect } from "react";
import { User, UserContextProps } from "../types/user";

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

// manages user state and syncs it with localStorage, providing user and setUser through UserContext
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>({
    accessToken: localStorage.getItem("accessToken"),
    userName: localStorage.getItem("userName"),
    avatarUrl: localStorage.getItem("avatarUrl"),
  });
  // Update localStorage whenever user state changes
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
