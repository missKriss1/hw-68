import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosApi from "../../../axiosApi.ts";
import { RootState } from "../../app/store.ts";

interface ToDoList {
  id: string;
  title: string;
  status: boolean;
}

interface ToDoListState {
  todolist: ToDoList[];
  loading: boolean;
  error: boolean;
}

const initialState: ToDoListState = {
  todolist: [],
  loading: false,
  error: false,
};

export const fetchTodoList = createAsyncThunk(
  "toDoList/fetchTodoList",
  async () => {
    const response = await axiosApi("toDoList.json");
    const todolist = response.data;

    if (todolist) {
      const todolistInFormat = Object.keys(todolist).map((todolistId) => ({
        ...todolist[todolistId],
        id: todolistId,
      }));
      todolistInFormat.reverse();
      return todolistInFormat;
    }
    return [];
  },
);

export const fetchToDoListPost = createAsyncThunk(
  "toDoList/fetchToDoListPost",
  async (title: string) => {
    const response = await axiosApi.post<ToDoList>(`toDoList.json`, {
      title,
      status: false,
    });
    return { ...response.data, id: response.data.id };
  },
);

export const fetchTodoListPutByChek = createAsyncThunk<
  void,
  { id: string },
  { state: RootState }
>("toDoList/fetchTodoListPutByChek", async ({ id }, thunkAPI) => {
  const task = thunkAPI
    .getState()
    .toDoList.todolist.find((task: ToDoList) => task.id === id);
  if (task) {
    await axiosApi.put(`toDoList/${id}.json`, {
      ...task,
      status: !task.status,
    });
  }
});

export const fetchToDoListDelete = createAsyncThunk<string, string>(
  `toDoList/fetchToDoListDelete`,
  async (id) => {
    await axiosApi.delete(`toDoList/${id}.json`);
    return id;
  },
);

export const toDoListSlice = createSlice({
  name: "toDoList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodoList.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchTodoList.fulfilled, (state, action) => {
        state.loading = false;
        state.todolist = action.payload;
      })
      .addCase(fetchTodoList.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchToDoListPost.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchToDoListPost.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchToDoListPost.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchTodoListPutByChek.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchTodoListPutByChek.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchTodoListPutByChek.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchToDoListDelete.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchToDoListDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.todolist.filter((task) => task.id !== action.payload);
      })
      .addCase(fetchToDoListDelete.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const toDoListReduser = toDoListSlice.reducer;
export const {} = toDoListSlice.actions;
