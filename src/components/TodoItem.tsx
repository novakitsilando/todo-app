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

const MAX_LENGTH = 300;

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
    if (!trimmed) {
      return;
    }

    onEdit(todo.id, trimmed);
  };

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submitEdit();
      return;
    }

    if (event.key === "Escape") {
      setDraftTitle(todo.title);
      onCancelEdit();
    }
  };

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Toggle ${todo.title}`}
      />

      {isEditing ? (
        <div>
          <input
            aria-label="Edit todo title"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onKeyDown={handleEditKeyDown}
            maxLength={MAX_LENGTH}
          />
          <button type="button" onClick={submitEdit}>
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setDraftTitle(todo.title);
              onCancelEdit();
            }}
          >
            Cancel
          </button>
          {draftTitle.length > 250 ? <p>{`${draftTitle.length}/${MAX_LENGTH}`}</p> : null}
          {error ? (
            <p role="alert" style={{ color: "red" }}>
              {error}
            </p>
          ) : null}
        </div>
      ) : (
        <>
          <span>{todo.title}</span>
          <button type="button" aria-label="Edit todo" onClick={() => onStartEdit(todo.id)}>
            ✏️
          </button>
        </>
      )}

      <button type="button" aria-label="Delete todo" onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}

export type { TodoItemProps };
