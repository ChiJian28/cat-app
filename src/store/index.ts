import { create } from "zustand";

interface CreatePostState {
    isCreate: boolean;
    setIsCreate: (value: boolean) => void;
}

export const useCreatePostStore = create<CreatePostState>()((set) => ({
    isCreate: false,
    setIsCreate: (value) => set({ isCreate: value })
}))
