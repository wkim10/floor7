import { ServerState } from "@/app/types";
import { create } from "zustand";

export interface AppStore {
  username: string;
  other?: string; // Socket ID of the other caller
  setOther: (other?: string) => void;
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
  setOther: (other?: string) => set({ other }),
  setUsername: (username: string) => set({ username }),
  connected: false,
  setConnected: (connected: boolean) => set({ connected }),
  serverState: new ServerState(),
  setServerState: (serverState: ServerState) => set({ serverState }),
  socketId: "",
  setSocketId: (socketId: string) => set({ socketId }),
}));

export default useAppStore;
