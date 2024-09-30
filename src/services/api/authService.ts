// AccessToken
export const setAccessToken = (accessToken: string): void => {
    localStorage.setItem('accessToken', accessToken);
  };
  
  export const getAccessToken = (): string | null =>
    localStorage.getItem('accessToken');
  
  export const clearAccessToken = (): void => {
    localStorage.removeItem('accessToken');
  };
  
  // userName
  export const setUserName = (name: string): void => {
    localStorage.setItem('userName', name);
  };
  
  export const getUserName = (): string | null =>
    localStorage.getItem('userName');
  
  export const clearUserName = (): void => {
    localStorage.removeItem('userName');
  };
  
// Avatar URL
export const setAvatarUrl = (avatarUrl: string): void => {
  localStorage.setItem("avatarUrl", avatarUrl);
};

export const getAvatarUrl = (): string | null => {
  return localStorage.getItem("avatarUrl");
};

export const clearAvatarUrl = (): void => {
  localStorage.removeItem("avatarUrl");
};

// For logOut
export const clearAuthData = (): void => {
  clearAccessToken();
  clearUserName();
  clearAvatarUrl();
};