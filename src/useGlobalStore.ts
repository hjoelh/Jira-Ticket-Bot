import create from "zustand";
import { GithubAccessTokenResponse } from "./types";

type Store = {
  user: GithubAccessTokenResponse | null;
  setUser: (user: Store["user"]) => void;
};

export const useGlobalStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
