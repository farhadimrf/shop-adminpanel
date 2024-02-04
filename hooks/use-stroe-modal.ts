import { create } from "zustand";

type useStoreModalType = {
   isOpen: boolean;
   onOpen: () => void;
   onClose: () => void;
};

export const useStoreModal = create<useStoreModalType>((set) => ({
   isOpen: false,
   onOpen: () => set({ isOpen: true }),
   onClose: () => set({ isOpen: false }),
}));
