"use client";

import TodoItem from "./TodoItem";
import type { Todo } from "@/src/types/todo";

interface TodoListProps {
  todos: Todo[];
  editingId: string | null;
  onStartEdit: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onCancelEdit: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  editError?: string | null;
}

export default function TodoList({ todos, editingId, onStartEdit, onEdit, onCancelEdit, onToggle, onDelete, editError = null }: TodoListProps) {
  if (todos.length === 0) {
    return <p>No todos yet — add one above!</p>;
  }

  return (
    <ul className="flex w-full min-w-0 flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingId === todo.id}
          onStartEdit={onStartEdit}
          onEdit={onEdit}
          onCancelEdit={onCancelEdit}
          onToggle={onToggle}
          onDelete={onDelete}
          error={editingId === todo.id ? editError : null}
        />
      ))}
    </ul>
  );
}

export type { TodoListProps };
