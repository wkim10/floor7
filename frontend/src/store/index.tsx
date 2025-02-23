import { ServerState } from "@/app/types";
import { create } from "zustand";

export interface AppStore {
  username: string;
  setUsername: (username: string) => void;
  connected: boolean;
  setConnected: (connected: boolean) => void;
  serverState: ServerState;
  setServerState: (state: ServerState) => void;
  socketId: string;
  setSocketId: (socketId: string) => void;
}

const useAppStore = create<AppStore>((set) => ({
  username: "",
  setUsername: (username: string) => set({ username }),
  connected: false,
  setConnected: (connected: boolean) => set({ connected }),
  serverState: new ServerState(),
  setServerState: (serverState: ServerState) => set({ serverState }),
  socketId: "",
  setSocketId: (socketId: string) => set({ socketId }),
}));

export default useAppStore;
