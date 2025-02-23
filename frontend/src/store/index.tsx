import { ServerState } from "@/app/types";
import { create } from "zustand";

export interface AppStore {
  username: string;
  other?: string; // Socket ID of the other caller
  setOther: (other: string) => void;
  setUsername: (username: string) => void;
  connected: boolean;
  setConnected: (connected: boolean) => void;
  serverState: ServerState;
  setServerState: (state: ServerState) => void;
}

const useAppStore = create<AppStore>((set) => ({
  username: "",
  setOther: (other) => set({ other }),
  setUsername: (username) => set({ username }),
  connected: false,
  setConnected: (connected) => set({ connected }),
  serverState: new ServerState(),
  setServerState: (serverState) => set({ serverState }),
}));

export default useAppStore;
