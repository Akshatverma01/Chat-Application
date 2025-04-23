import { create } from "zustand";
import AXIOS from "../lib/axios";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await AXIOS.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await AXIOS.post("/auth/signup", data);
      if (res.status !== 201) {
        throw new Error(res.error);
      }
      set({ authUser: res.data });
      toast.success("Account created successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Something went wrong!");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await AXIOS.post("/auth/login", data);
      if (res.status !== 200) {
        throw new Error(res.error);
      }
      set({ authUser: res.data });
      toast.success("Logged in successfully!");
    } catch (error) {
      console.log(error.message);
      toast.error(error?.data?.message || "Something went wrong!");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logOut: async () => {
    try {
      const res = await AXIOS.post("/auth/logout");
      if (res.status !== 200) {
        throw new Error(res.error);
      }
      set({ authUser: null });
      toast.success("Logged out sucessfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  },
  updateProfile: async (image) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await AXIOS.put("/auth/update-profile", image);
      if (res.status !== 200) {
        throw new Error(res.error);
      }
      set({ authUser: res.data });
      toast.success("profile Updated sucessfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
