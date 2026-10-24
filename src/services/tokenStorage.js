import { getStorage, setStorage, removeStorage } from "../utils/storage";

let inMemoryAccessToken = null;

const REFRESH_TOKEN_KEY = "_auth_refresh_token_sec";

export const tokenStorage = {
  getAccessToken() {
    return inMemoryAccessToken;
  },

  setAccessToken(token) {
    inMemoryAccessToken = token;
  },

  clearAccessToken() {
    inMemoryAccessToken = null;
  },

  getRefreshToken() {
    return getStorage(REFRESH_TOKEN_KEY, null);
  },

  setRefreshToken(token) {
    setStorage(REFRESH_TOKEN_KEY, token);
  },

  clearRefreshToken() {
    removeStorage(REFRESH_TOKEN_KEY);
  },

  clearAll() {
    inMemoryAccessToken = null;
    removeStorage(REFRESH_TOKEN_KEY);
  },
};
