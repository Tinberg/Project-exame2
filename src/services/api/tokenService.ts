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
  
  // Clear data on logout
  export const clearAuthData = (): void => {
    clearAccessToken();
    clearUserName();
  };