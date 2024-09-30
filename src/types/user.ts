export interface User {
  accessToken: string | null;
  userName: string | null;
  avatarUrl: string | null;
}

export interface UserContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}
