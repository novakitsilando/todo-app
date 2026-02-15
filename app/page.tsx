"use client";

import { useEffect, useState } from "react";

import TodoItem from "@/src/components/TodoItem";
import { deleteTodo, getTodos } from "@/src/services/todoStorage";
import type { Todo } from "@/src/types/todo";

const EMPTY_STATE = "No todos yet — add one above!";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setTodos(getTodos());
  }, []);

  const handleDelete = (id: string) => {
    deleteTodo(id);
    setTodos((current) => current.filter((todo) => todo.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  return (
    <main>
      <h1>Todo App</h1>

      {todos.length === 0 ? <p>{EMPTY_STATE}</p> : null}

      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={editingId === todo.id}
            onStartEdit={setEditingId}
            onEdit={() => undefined}
            onCancelEdit={() => setEditingId(null)}
            onToggle={() => undefined}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </main>
  );
}
