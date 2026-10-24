import React, { createContext, useContext, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, logoutUser } from "../store/slices/authSlice";

const AuthStateContext = createContext(null);
const AuthDispatchContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user: currentUser, isLoading: loading } = useSelector(selectAuth);
  const dispatch = useDispatch();

  const stateValue = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!(currentUser?._id || currentUser?.id),
      loading,
    }),
    [currentUser, loading],
  );

  const dispatchValue = useMemo(
    () => ({
      logout: () => dispatch(logoutUser()),
    }),
    [dispatch],
  );

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthDispatchContext.Provider value={dispatchValue}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
