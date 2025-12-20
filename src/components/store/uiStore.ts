import { create } from "zustand";

type UIState = {
  isCommentModalOpen: boolean;
  setCommentModalOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  isCommentModalOpen: false,
  setCommentModalOpen: (open) => set({ isCommentModalOpen: open }),
}));