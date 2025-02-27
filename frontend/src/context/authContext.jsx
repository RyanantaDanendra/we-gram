import { createContext, useReducer } from "react";
import { useEffect } from "react";
import SearchedUser from "../pages/SearchedUser";

export const AuthContext = createContext();

export const authRedcer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    case "UPDATE_USERNAME":
      return { user: { ...state.user, username: action.payload } };
    case "UPDATE_USER_PICTURE":
      return { user: { ...state.user, picture: action.payload } };
    case "SEARCHED_USER":
      return { ...state, searchedUser: action.payload };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authRedcer, {
    user: null,
    searchedUser: null,
  });

  // useEffect(() => {
  //   if (state.user) {
  //     localStorage.setItem("user", JSON.stringify(state.user));
  //   }
  // }, [state.user]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.user) {
      dispatch({ type: "LOGIN", payload: user.user });
    }
  }, [dispatch]);

  useEffect(() => {
    const searchedUser = JSON.parse(localStorage.getItem("searchedUser"));

    if (searchedUser) {
      dispatch({ type: "SEARCHED_USER", payload: searchedUser });
    }
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
