"use client";

import { useEffect, useMemo, useState } from "react";

import AddTodo from "@/src/components/AddTodo";
import TodoList from "@/src/components/TodoList";
import { addTodo, deleteTodo, getTodos, toggleTodo, updateTodo, StorageFullError, InvalidTodoError, TodoNotFoundError } from "@/src/services/todoStorage";
import type { Todo } from "@/src/types/todo";

const sortByNewest = (todos: Todo[]) => [...todos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    setTodos(sortByNewest(getTodos()));
  }, []);

  const visibleTodos = useMemo(() => sortByNewest(todos), [todos]);

  const onAdd = (title: string) => {
    try {
      const todo = addTodo(title);
      setTodos((p) => sortByNewest([todo, ...p]));
      setAddError(null);
    } catch (e) {
      if (e instanceof StorageFullError) setAddError("Storage is full. Please remove some todos and try again.");
    }
  };

  const onEdit = (id: string, newTitle: string) => {
    try {
      const updated = updateTodo(id, newTitle);
      setTodos((p) => p.map((t) => (t.id === id ? updated : t)));
      setEditingId(null);
      setEditError(null);
    } catch (e) {
      if (e instanceof StorageFullError) {
        setEditError("Storage is full. Please remove some todos and try again.");
        return;
      }
      if (e instanceof InvalidTodoError || e instanceof TodoNotFoundError) {
        setEditingId(null);
        setTodos(sortByNewest(getTodos()));
      }
    }
  };

  const onDelete = (id: string) => {
    try {
      deleteTodo(id);
      setTodos((p) => p.filter((t) => t.id !== id));
      if (editingId === id) setEditingId(null);
    } catch {}
  };

  const onToggle = (id: string) => {
    try {
      const updated = toggleTodo(id);
      setTodos((p) => p.map((t) => (t.id === id ? updated : t)));
    } catch {}
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 p-4 sm:p-6">
      <h1 className="text-3xl font-bold">Todo List</h1>
      <AddTodo onAdd={onAdd} error={addError} />
      <TodoList
        todos={visibleTodos}
        editingId={editingId}
        onStartEdit={setEditingId}
        onEdit={onEdit}
        onCancelEdit={() => {
          setEditingId(null);
          setEditError(null);
        }}
        onToggle={onToggle}
        onDelete={onDelete}
        editError={editError}
      />
    </main>
  );
}
