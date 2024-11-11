import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { useEffect, useState } from "react";
import {
  fetchTodoList,
  fetchToDoListDelete,
  fetchToDoListPost,
  fetchTodoListPutByChek,
} from "./toDoListSlice";
import Spinner from "../../UI/Spinner/Spinner.tsx";
import * as React from "react";

const ToDoList = () => {
  const dispatch: AppDispatch = useDispatch();
  const { todolist, loading, error } = useSelector(
    (state: RootState) => state.toDoList,
  );
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    dispatch(fetchTodoList());
  }, [dispatch]);

  const addToDoList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim().length !== 0) {
      await dispatch(fetchToDoListPost(newMessage));
      await dispatch(fetchTodoList());
      setNewMessage("");
    } else {
      alert("Enter the task!");
    }
  };

  const deleteToDoList = async (id: string) => {
    await dispatch(fetchToDoListDelete(id));
    await dispatch(fetchTodoList());
  };

  const chekToDoList = async (id: string) => {
    await dispatch(fetchTodoListPutByChek({ id }));
    await dispatch(fetchTodoList());
  };

  return (
    <div className="container">
      <h2>To Do List</h2>
      <hr />
      <form onSubmit={addToDoList}>
        <label className="form-label mt-4">Add new task:</label>
        <input
          className=" form-control w-25"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary mt-3 mb-4">
          Add
        </button>
      </form>
      <div>
        {loading ? (
          <Spinner />
        ) : error ? (
          <p>There was an error loading the tasks.</p>
        ) : (
          <div>
            {todolist && todolist.length > 0 ? (
              todolist.map((todo) => (
                <div key={todo.id} className="row">
                  <div className="col-2">
                    <strong>{todo.title}</strong>
                    <input
                      className="ms-3"
                      type="checkbox"
                      checked={todo.status}
                      onChange={() => chekToDoList(todo.id)}
                    />
                    {todo.status}
                  </div>
                  <div className="col-2">
                    <button
                      onClick={() => deleteToDoList(todo.id)}
                      className="btn btn-close"
                    ></button>
                  </div>
                  <hr />
                </div>
              ))
            ) : (
              <p>No tasks available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDoList;
