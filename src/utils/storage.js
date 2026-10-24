
export const getStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
};

export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
    return false;
  }
};

export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
    return false;
  }
};

export const saveUser = (newUser) => {
  try {
    const users = getStorage("users", []);

    const existingUser = users.find(
      (u) => u.email.toLowerCase() === newUser.email.toLowerCase()
    );

    if (existingUser) {
      throw new Error("An account with this email address already exists.");
    }

    const updatedUsers = [...users, newUser];
    setStorage("users", updatedUsers);

    return { success: true, user: newUser };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
