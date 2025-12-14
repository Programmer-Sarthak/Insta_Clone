export const useAuth = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token);

  return { isAuthenticated };
};
