"use client";

import { useEffect, useState } from "react";

import TodoItem from "@/src/components/TodoItem";
import {
  getTodos,
  InvalidTodoError,
  StorageFullError,
  TodoNotFoundError,
  updateTodo,
} from "@/src/services/todoStorage";
import type { Todo } from "@/src/types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    setTodos(getTodos());
  }, []);

  const handleStartEdit = (id: string) => {
    setEditingId(id);
    setEditError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditError(null);
  };

  const handleEdit = (id: string, newTitle: string) => {
    try {
      const updatedTodo = updateTodo(id, newTitle);
      setTodos((current) =>
        current.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
      setEditingId(null);
      setEditError(null);
    } catch (error) {
      if (error instanceof StorageFullError) {
        setEditError("Storage is full. Please remove some todos and try again.");
        return;
      }

      if (error instanceof InvalidTodoError || error instanceof TodoNotFoundError) {
        setEditingId(null);
        setEditError(null);
        setTodos(getTodos());
        return;
      }

      setEditingId(null);
      setEditError("Failed to update todo.");
      setTodos(getTodos());
    }
  };

  return (
    <main>
      <h1>Todo App</h1>
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={editingId === todo.id}
            onStartEdit={handleStartEdit}
            onEdit={handleEdit}
            onCancelEdit={handleCancelEdit}
            onToggle={() => undefined}
            onDelete={() => undefined}
            error={editingId === todo.id ? editError : null}
          />
        ))}
      </ul>
    </main>
  );
}
