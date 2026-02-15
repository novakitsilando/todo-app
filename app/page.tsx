"use client";

import { useEffect, useState } from "react";

import AddTodo from "@/src/components/AddTodo";
import {
  addTodo,
  getTodos,
  InvalidTodoError,
  StorageFullError,
} from "@/src/services/todoStorage";
import type { Todo } from "@/src/types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTodos(getTodos());
  }, []);

  const handleAdd = (title: string) => {
    try {
      const created = addTodo(title);
      setTodos((prev) => [created, ...prev]);
      setError(null);
    } catch (err) {
      if (err instanceof StorageFullError) {
        setError("Storage is full. Please remove some todos and try again.");
        return;
      }

      if (err instanceof InvalidTodoError) {
        return;
      }

      setError("Failed to add todo. Please try again.");
    }
  };

  return (
    <main>
      <h1>Todo App</h1>
      <AddTodo onAdd={handleAdd} error={error} />

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </main>
  );
}
