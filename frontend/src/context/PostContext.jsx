import { createContext, useReducer } from "react";

export const PostContext = createContext();

export const PostReducer = (state, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return { posts: action.payload };
    case "UPLOAD_POST":
      return { posts: [action.payload, ...state.posts] };
    default:
      return state;
  }
};

export const PostContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PostReducer, {
    posts: [],
  });

  return (
    <PostContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PostContext.Provider>
  );
};
