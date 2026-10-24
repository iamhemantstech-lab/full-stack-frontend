import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../services/apiClient";
import { tokenStorage } from "../../services/tokenStorage";

const storedUser = localStorage.getItem("user");

const authRoute = {
  REGISTER_ENDPOINT: "/users/register",
  LOGIN_ENDPOINT: "/users/login",
  LOGOUT_ENDPOINT: "/users/logout",
};

// thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (args, { rejectWithValue }) => {
    try {
      let payload = args;
      let customHeaders = {};

      const isFormData =
        typeof FormData !== "undefined" && payload instanceof FormData;

      const headers = {
        ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
        ...customHeaders, // Any custom headers you want to pass
      };

      const response = await apiClient.post(
        authRoute.REGISTER_ENDPOINT,
        payload,
        {
          headers: {
            ...headers,
          },
        },
      );

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(authRoute.LOGIN_ENDPOINT, payload);

      console.log("thunk response", response);

      const { user, accessToken, refreshToken } = response?.data?.data || {};

      if (accessToken) {
        tokenStorage.setAccessToken(accessToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      }

      if (refreshToken && typeof tokenStorage.setRefreshToken === "function") {
        tokenStorage.setRefreshToken(refreshToken);
      }

      if (user) {
        // Persist user so refreshing the browser won't log them out
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log("api");

      const response = await apiClient.post(authRoute.LOGOUT_ENDPOINT);

      console.log("thunk logout esponse", response);

      localStorage.removeItem("user");
      tokenStorage.clearAll();
      delete apiClient.defaults.headers.common.Authorization;

      return response.data;
    } catch (error) {
      localStorage.removeItem("user");
      tokenStorage.clearAll();
      delete apiClient.defaults.headers.common.Authorization;

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Logout failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetAuthState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data; // User data from backend ApiResponse
        state.message =
          action.payload.message || "Account registered successfully!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // Contains message from rejectWithValue
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        // Backend returns: { user, accessToken, refreshToken } in action.payload.data
        state.user = action.payload.data?.user || action.payload.data;
        state.message = action.payload.message || "Logged in successfully!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload; // error message from rejectWithValue
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null; // Clear user even if network/backend logout errored
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      });
  },
});

export const { resetAuthState } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthMessage = (state) => state.auth.message;

export default authSlice.reducer;
