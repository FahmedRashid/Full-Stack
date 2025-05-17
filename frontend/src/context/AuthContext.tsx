import React, {
  createContext,
  useReducer,
  Dispatch,
  ReactNode,
  useEffect,
} from "react";

interface User {
  firstName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

//define states and action types
interface UserState {
  user: User | null;
}
//Auth actions
type UserAction = { type: "LOGIN"; payload: User } | { type: "LOGOUT" };

// AuthContext type
interface AuthContextType {
  state: UserState;
  dispatch: Dispatch<UserAction>;
}

// Create Context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Reducer function
export const authReducer = (
  state: UserState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

// Children typing and returning JSX.element
interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parseUser = JSON.parse(storedUser);

      //convert string dates back to date objects
      const userWithDates: User = {
        ...parseUser,
        // firstName: parseUser.firstName
        // createdAt: new Date(parseUser.createdAt),
        // updatedAtAt: new Date(parseUser.updatedAt)
      };
      dispatch({ type: "LOGIN", payload: userWithDates });
    }
  }, []);
  // console.log("AuthContext State: ", state);
  // console.log("User logged in with email:", state.user?.email);
  const safeUser = {
    email: state.user?.email,
    // no password or token here
  };
  console.log("User info: " + JSON.stringify(safeUser));
  // console.table(safeUser);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
