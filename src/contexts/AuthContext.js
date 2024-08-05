import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    case "UPDATE_PRIVACY":
      return {
        ...state,
        user: { ...state.user, isPrivate: action.payload.isPrivate },
      };
    case "UPDATE_PFP":
      return {
        ...state,
        user: { ...state.user, profilePic: action.payload.profilePic },
      };
    case "ACCEPT_REQUEST":
      return {
        ...state,
        user: {
          ...state.user,
          friends: action.payload.friends,
          friendRequests: action.payload.friendRequests,
        },
      };

    case "REJECT_REQUEST":
      return {
        ...state,
        user: {
          ...state.user,
          friendRequests: action.payload.friendRequests,
        },
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
