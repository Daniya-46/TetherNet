import { createContext, useReducer } from "react";

export const PostContext = createContext();

export const postReducer = (state, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return {
        posts: action.payload,
      };
    case "CREATE_POST":
      return {
        posts: [action.payload, ...state.posts],
      };
    case "DELETE_POST":
      return {
        posts: state.posts.filter((post) => post.id !== action.payload),
      };
    case "LIKE_POST":
      return {
        posts: state.posts.map((post) => {
          if (post._id === action.payload._id) {
            return { ...post, likes: action.payload.likes };
          }
          return post;
        }),
      };
    case "COMMENT_POST":
      return {
        posts: state.posts.map((post) => {
          if (post._id === action.payload._id) {
            return { ...post, comments: action.payload.comments };
          }
          return post;
        }),
      };
    default:
      return state;
  }
};

export const PostContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, {
    posts: [],
  });

  return (
    <PostContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PostContext.Provider>
  );
};
