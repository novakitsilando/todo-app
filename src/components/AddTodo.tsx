"use client";

import { FormEvent, useState } from "react";

interface AddTodoProps {
  onAdd: (title: string) => void;
  error?: string | null;
}

export default function AddTodo({ onAdd, error = null }: AddTodoProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    if (!error) setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="flex gap-2">
        <input
          aria-label="Todo title"
          placeholder="Add a new todo..."
          maxLength={300}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Add
        </button>
      </div>
      {title.length > 250 ? <p className="text-sm text-gray-500">{title.length}/300</p> : null}
      {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}

export type { AddTodoProps };
