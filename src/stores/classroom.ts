/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { createJSONStorage } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { Classroom } from "../types/classroom";
interface ClasroomStore {
  teachingClassrooms: Classroom[];
  registeredClassrooms: Classroom[];
  setTeachingClassrooms: (classrooms: Classroom[]) => void;
  setRegisteredClassrooms: (classrooms: Classroom[]) => void;
  reset: () => void;
}

const initialState = {
  teachingClassrooms: [],
  registeredClassrooms: [],
};

const useClassroomStore = create<ClasroomStore>()(
  persist(
    (set) => ({
      ...initialState,
      setTeachingClassrooms: (classrooms) =>
        set((_state) => ({ teachingClassrooms: classrooms })),
      setRegisteredClassrooms: (classrooms) =>
        set((_state) => ({ registeredClassrooms: classrooms })),
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "classroom-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useClassroomStore;
