import { configureStore } from "@reduxjs/toolkit";
import { toDoListReduser } from '../Container /ToDoList/toDoListSlice.ts';

export const store = configureStore({
  reducer: {
    toDoList: toDoListReduser,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
