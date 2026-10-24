import { createContext, useContext, useEffect, useReducer } from "react";

const StateContext = createContext(null);
const DispatchContext = createContext(null);

const initalState = {
  theme: localStorage.getItem("tehem") || "dark",
  user: {
    name: "John",
    notificationsCount: 3,
  },
};

const myReducers = (state, action) => {
  switch (action.type) {
    case "TOOGLE_THEME":
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };
    case "UPDATE_USER_NAME":
      return {
        ...state,
        user: {
          ...state.user,
          name: action.payload,
        },
      };
    case "INCRESE_COUNT":
      return {
        ...state,
        user: {
          ...state.user,
          notificationsCount: state.user.notificationsCount + 1,
        },
      };
    default:
      return state;
  }
};

export const DataContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(myReducers, initalState);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
    localStorage.setItem("theme", state.theme);
  }, [state.theme]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(DispatchContext);
  return context;
};
