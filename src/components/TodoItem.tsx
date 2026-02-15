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

export default function TodoItem({
  todo,
  isEditing,
  onStartEdit,
  onEdit,
  onCancelEdit,
  onToggle,
  onDelete,
  error = null,
}: TodoItemProps) {
  const [draftTitle, setDraftTitle] = useState(todo.title);

  useEffect(() => {
    if (isEditing) {
      setDraftTitle(todo.title);
    }
  }, [isEditing, todo.title]);

  const submitEdit = () => {
    const trimmed = draftTitle.trim();
    if (!trimmed) return;
    onEdit(todo.id, trimmed);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") submitEdit();
    if (event.key === "Escape") onCancelEdit();
  };

  return (
    <li className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Toggle ${todo.title}`}
        className="h-4 w-4"
      />

      {isEditing ? (
        <div>
          <input
            aria-label="Edit todo title"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onKeyDown={onKeyDown}
            maxLength={300}
          />
          <button type="button" onClick={submitEdit}>
            Save
          </button>
          <button type="button" onClick={onCancelEdit}>
            Cancel
          </button>
          {error ? (
            <p role="alert" className="text-red-600">
              {error}
            </p>
          ) : null}
        </div>
      ) : (
        <span className={todo.completed ? "line-through text-gray-500" : "text-gray-900"}>
          {todo.title}
        </span>
      )}

      <button type="button" aria-label="Edit todo" onClick={() => onStartEdit(todo.id)}>
        ✏️
      </button>
      <button type="button" aria-label="Delete todo" onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}

export type { TodoItemProps };
