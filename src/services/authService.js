import { getStorage, setStorage } from "../utils/storage";
import { createMockJWT, decodeMockJWT } from "./jwt";
import { tokenStorage } from "./tokenStorage";

const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 Minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 Days

const sleep = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_DEMO_USERS = [
  {
    id: "demo-admin-01",
    firstName: "Alex",
    lastName: "Morgan",
    email: "admin@crm.com",
    mobileNumber: "+1 555-0199",
    password: "admin",
    role: "admin",
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-user-01",
    firstName: "Sarah",
    lastName: "Connor",
    email: "user@crm.com",
    mobileNumber: "+1 555-0188",
    password: "user",
    role: "user",
    status: "Active",
    createdAt: new Date().toISOString(),
  },
];

const getOrInitUsers = () => {
  const users = getStorage("users", null);
  if (!users || !Array.isArray(users) || users.length === 0) {
    setStorage("users", DEFAULT_DEMO_USERS);
    return DEFAULT_DEMO_USERS;
  }
  return users;
};

export const authService = {
  async signup(userData) {
    await sleep(500);

    // Support both FormData (for file uploads) and plain object
    const isFormData = typeof FormData !== "undefined" && userData instanceof FormData;
    const email = isFormData ? userData.get("email") : userData.email;
    const firstname = isFormData ? userData.get("firstname") : (userData.firstname || userData.firstName);
    const lastname = isFormData ? userData.get("lastname") : (userData.lastname || userData.lastName);
    const mobNumber = isFormData ? userData.get("mobNumber") : (userData.mobNumber || userData.mobileNumber);

    const users = getOrInitUsers();

    const emailExists = users.some(
      (o) => o.email.toLowerCase() === (email || "").toLowerCase(),
    );

    if (emailExists) {
      throw new Error("An account with this email address already exists.");
    }

    const newUser = {
      id: crypto.randomUUID(),
      role: "user",
      status: "Active",
      firstname,
      lastname,
      email,
      mobNumber,
      avatar: isFormData && userData.get("avatar") ? URL.createObjectURL(userData.get("avatar")) : "",
      coverImage: isFormData && userData.get("coverImage") ? URL.createObjectURL(userData.get("coverImage")) : "",
      createdAt: new Date().toISOString(),
    };

    setStorage("users", [...users, newUser]);
    return {
      success: true,
      message: "Account created successfully.",
    };
  },

  async login(loginData) {
    await sleep(500);

    const users = getOrInitUsers();
    const user = users.find(
      (o) =>
        o.email.toLowerCase() === loginData.email.toLowerCase() &&
        o.password === loginData.password,
    );

    if (!user) {
      throw new Error("Invalid email or password. Please try again.");
    }

    const { password: _, ...safeUser } = user;
    const accessToken = createMockJWT(
      {
        id: safeUser.id,
        email: safeUser.email,
        firstName: safeUser.firstName,
        role: safeUser.role || "user",
      },
      ACCESS_TOKEN_EXPIRY,
    );

    const refreshToken = createMockJWT(
      { id: safeUser.id },
      REFRESH_TOKEN_EXPIRY,
    );

    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);

    return {
      user: safeUser,
      accessToken,
    };
  },

  async refreshToken() {
    await sleep(200);

    const currentRefreshToken = tokenStorage.getRefreshToken();
    if (!currentRefreshToken) {
      throw new Error("No refresh token available.");
    }

    const decode = decodeMockJWT(currentRefreshToken);
    if (!decode || decode.isExpired) {
      tokenStorage.clearAll();
      throw new Error("Session expired. Please log in again.");
    }

    const users = getOrInitUsers();
    const user = users.find((o) => o.id === decode.payload.id);

    if (!user) {
      tokenStorage.clearAll();
      throw new Error("User no longer exists.");
    }

    const { password: _, ...safeUser } = user;
    const newAccessToken = createMockJWT(
      {
        id: safeUser.id,
        email: safeUser.email,
        firstName: safeUser.firstName,
        role: safeUser.role || "user",
      },
      ACCESS_TOKEN_EXPIRY,
    );

    const newRefreshToken = createMockJWT(
      { id: safeUser.id },
      REFRESH_TOKEN_EXPIRY,
    );

    tokenStorage.setAccessToken(newAccessToken);
    tokenStorage.setRefreshToken(newRefreshToken);

    return {
      user: safeUser,
      accessToken: newAccessToken,
    };
  },

  async updateUserRole(userId, newRole) {
    const users = getOrInitUsers();
    const userIndex = users.findIndex((o) => o.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found.");
    }

    users[userIndex] = {
      ...users[userIndex],
      role: newRole,
    };
    setStorage("users", users);

    const { password: _, ...safeUser } = users[userIndex];
    const newAccessToken = createMockJWT(
      {
        id: safeUser.id,
        email: safeUser.email,
        firstName: safeUser.firstName,
        role: safeUser.role,
      },
      ACCESS_TOKEN_EXPIRY,
    );
    tokenStorage.setAccessToken(newAccessToken);

    return safeUser;
  },

  async logout() {
    await sleep(200);
    tokenStorage.clearAll();
    return { success: true };
  },
};
