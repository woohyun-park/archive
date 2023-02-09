import create from "zustand";
import { devtools } from "zustand/middleware";

interface IUseModal {
  modalLoader: boolean;
  setModalLoader: (modalLoader: boolean) => void;
}

export const useModal = create<IUseModal>()(
  devtools((set, get) => ({
    modalLoader: false,
    setModalLoader: (modalLoader: boolean) => {
      set((state: IUseModal) => {
        return {
          ...state,
          modalLoader,
        };
      });
    },
  }))
);
