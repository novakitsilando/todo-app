"use client";

import { KeyboardEvent, useEffect, useState } from "react";
import type { Todo } from "@/src/types/todo";

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  onStartEdit: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onCancelEdit: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  error?: string | null;
}

export default function TodoItem({ todo, isEditing, onStartEdit, onEdit, onCancelEdit, onToggle, onDelete, error = null }: TodoItemProps) {
  const [draft, setDraft] = useState(todo.title);
  useEffect(() => {
    if (isEditing) setDraft(todo.title);
  }, [isEditing, todo.title]);

  const save = () => {
    const t = draft.trim();
    if (!t) return;
    onEdit(todo.id, t);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") onCancelEdit();
  };

  return (
    <li className="flex items-center gap-2 rounded border p-2" data-testid="todo-item">
      <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} aria-label={`Toggle ${todo.title}`} className="h-4 w-4" />
      {isEditing ? (
        <div className="min-w-0 flex-1">
          <input aria-label="Edit todo title" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown} maxLength={300} className="w-full rounded border px-2 py-1" />
          <div className="mt-1 flex gap-2">
            <button type="button" onClick={save}>Save</button>
            <button type="button" onClick={onCancelEdit}>Cancel</button>
          </div>
          {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
        </div>
      ) : (
        <span className={`min-w-0 flex-1 truncate ${todo.completed ? "line-through text-gray-500" : "text-gray-900"}`}>{todo.title}</span>
      )}
      <button aria-label="Edit todo" type="button" onClick={() => onStartEdit(todo.id)}>✏️</button>
      <button aria-label="Delete todo" type="button" onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}

export type { TodoItemProps };
