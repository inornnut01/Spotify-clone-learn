import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import type { User } from "@/types";

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  selectedUser: User | null;

  setSelectedUser: (user: User | null) => void;
  fetchUsers: () => Promise<void>;
}

export const useChatStore = create<ChatStore>((set) => ({
  users: [],
  isLoading: false,
  error: null,
  selectedUser: null,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),

  setSelectedUser: (user) => set({ selectedUser: user }),

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users");
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
