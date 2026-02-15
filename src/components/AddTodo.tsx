"use client";

<<<<<<< HEAD
import { FormEvent, useMemo, useState } from "react";
=======
import { FormEvent, useState } from "react";
>>>>>>> b4c7c5c (feat: integrate AddTodo with localStorage on main page (#10))

interface AddTodoProps {
  onAdd: (title: string) => void;
  error?: string | null;
}

<<<<<<< HEAD
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
=======
export default function AddTodo({ onAdd, error = null }: AddTodoProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return;

    onAdd(trimmed);
    if (!error) setTitle("");
>>>>>>> b4c7c5c (feat: integrate AddTodo with localStorage on main page (#10))
  };

  return (
    <form onSubmit={handleSubmit}>
<<<<<<< HEAD
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

=======
      <input
        aria-label="Todo title"
        placeholder="Add a new todo..."
        maxLength={300}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button type="submit">Add</button>
      {title.length > 250 ? <p>{`${title.length}/300`}</p> : null}
>>>>>>> b4c7c5c (feat: integrate AddTodo with localStorage on main page (#10))
      {error ? (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      ) : null}
    </form>
  );
}

export type { AddTodoProps };
