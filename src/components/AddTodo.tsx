"use client";

import { FormEvent, useMemo, useState } from "react";

interface AddTodoProps {
  onAdd: (title: string) => void;
  error?: string | null;
}

const MAX_LENGTH = 300;
const COUNTER_THRESHOLD = 250;

export default function AddTodo({ onAdd, error = null }: AddTodoProps) {
  const [title, setTitle] = useState("");

  const shouldShowCounter = useMemo(
    () => title.length > COUNTER_THRESHOLD,
    [title.length],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    onAdd(trimmedTitle);

    if (!error) {
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a new todo..."
          maxLength={MAX_LENGTH}
          aria-label="Todo title"
        />
        <button type="submit">Add</button>
      </div>

      {shouldShowCounter ? (
        <p aria-live="polite">{`${title.length}/${MAX_LENGTH}`}</p>
      ) : null}

      {error ? (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      ) : null}
    </form>
  );
}

export type { AddTodoProps };
