"use client";

import { useEffect, useState } from "react";

import TodoItem from "@/src/components/TodoItem";
import { getTodos, toggleTodo } from "@/src/services/todoStorage";
import type { Todo } from "@/src/types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setTodos(getTodos());
  }, []);

  const handleToggle = (id: string) => {
    const updated = toggleTodo(id);
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, completed: updated.completed } : todo)),
    );
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
            onStartEdit={setEditingId}
            onEdit={() => undefined}
            onCancelEdit={() => setEditingId(null)}
            onToggle={handleToggle}
            onDelete={() => undefined}
          />
        ))}
      </ul>
    </main>
  );
}
