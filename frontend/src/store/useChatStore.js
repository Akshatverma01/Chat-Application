import { create } from "zustand";
import toast from "react-hot-toast";
import AXIOS from "../lib/axios";

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLooading: false,
  isMessagesLoading: false,
  isSendingMessage:false,

  getUsers: async () => {
    set({ isUsersLooading: true });
    try {
      const res = await AXIOS.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLooading: false });
    }
  },

  getMessages: async (userID) => {
    set({ isMessagesLoading: true });
    try {
      const res = await AXIOS.get(`/messages/${userID}`);
      console.log(res,"res")
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sentMessage:async(messageData)=>{
    const {selectedUser,messages} = get();
    set({isSendingMessage:true})
    try {
      const res = await AXIOS.post(`/messages/send/${selectedUser._id}`,messageData);
      set({ messages: [...messages, res.data] });

    } catch (error) {
      toast.error(error.response.data.message);
    }finally{ 
      set({isSendingMessage:false})
    }
  },

  setSelectedUser:(selectedUser)=>{set({selectedUser})}
}));
