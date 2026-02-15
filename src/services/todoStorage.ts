import type { Todo } from "@/src/types/todo";

const STORAGE_KEY = "todos";
const MAX_TITLE = 300;

export class StorageFullError extends Error {}
export class InvalidTodoError extends Error {}
export class TodoNotFoundError extends Error {}

const isQuotaExceededError = (error: unknown): boolean =>
  error instanceof DOMException &&
  (error.code === 22 || error.name === "QuotaExceededError");

const validateTitle = (title: string): string => {
  const trimmed = title.trim();
  if (!trimmed) throw new InvalidTodoError("Todo title cannot be empty");
  if (trimmed.length > MAX_TITLE) throw new InvalidTodoError("Todo title cannot exceed 300 characters");
  return trimmed;
};

export const getTodos = (): Todo[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Todo[]) : [];
  } catch {
    return [];
  }
};

export const saveTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    if (isQuotaExceededError(error)) throw new StorageFullError("Storage full");
    throw error;
  }
};

export const addTodo = (title: string): Todo => {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title: validateTitle(title),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  saveTodos([todo, ...getTodos()]);
  return todo;
};

export const updateTodo = (id: string, newTitle: string): Todo => {
  const todos = getTodos();
  const i = todos.findIndex((t) => t.id === id);
  if (i < 0) throw new TodoNotFoundError("Todo not found");
  const updated = { ...todos[i], title: validateTitle(newTitle) };
  const next = [...todos];
  next[i] = updated;
  saveTodos(next);
  return updated;
};

export const deleteTodo = (id: string): void => {
  const todos = getTodos();
  const i = todos.findIndex((t) => t.id === id);
  if (i < 0) throw new TodoNotFoundError("Todo not found");
  saveTodos([...todos.slice(0, i), ...todos.slice(i + 1)]);
};

export const toggleTodo = (id: string): Todo => {
  const todos = getTodos();
  const i = todos.findIndex((t) => t.id === id);
  if (i < 0) throw new TodoNotFoundError("Todo not found");
  const updated = { ...todos[i], completed: !todos[i].completed };
  const next = [...todos];
  next[i] = updated;
  saveTodos(next);
  return updated;
};
