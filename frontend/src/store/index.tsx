import { ServerState } from "@/app/types";
import { create } from "zustand";

export interface AppStore {
  username: string;
  setUsername: (username: string) => void;
  connected: boolean;
  setConnected: (connected: boolean) => void;
  serverState: ServerState;
  setServerState: (state: ServerState) => void;
}

const useAppStore = create<AppStore>((set) => ({
  username: "",
  setUsername: (username) => set({ username }),
  connected: false,
  setConnected: (connected) => set({ connected }),
  serverState: new ServerState(),
  setServerState: (serverState) => set({ serverState }),
}));

export default useAppStore;
