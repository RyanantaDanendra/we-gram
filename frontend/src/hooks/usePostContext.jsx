import { useContext } from "react";
import { PostContext } from "../context/PostContext";

export const usePostContext = () => {
  const context = useContext(PostContext);

  if (!context) {
    throw Error("useAuthContext must be used inside an AuthContextProvider");
  }

  return context;
};
