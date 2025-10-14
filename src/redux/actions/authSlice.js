import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("user"),
    permissions: null,
    currentPath: JSON.parse(localStorage.getItem("currentPath")) || null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.permissions = null;
      localStorage.removeItem("user");
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload
    },
    updateUserData: (state, action) => {
      state.user = { ...state, ...state.user, userData: action.payload };
      localStorage.removeItem('user');
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    setCurrentPath: (state, action) => {
      state.currentPath = action.payload
      localStorage.removeItem("currentPath");
      localStorage.setItem("currentPath", JSON.stringify(action.payload));
    }
  },
});

export const { login, logout, updateUserData, setPermissions, setCurrentPath } = authSlice.actions;
export default authSlice.reducer;
