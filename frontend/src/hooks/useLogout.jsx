import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    localStorage.removeItem("user");

    await dispatch({ type: "LOGOUT", payload: null });
  };

  return { logout };
};
