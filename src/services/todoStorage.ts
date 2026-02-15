import type { Todo } from "@/src/types/todo";

const STORAGE_KEY = "todos";

export class StorageFullError extends Error {
  constructor(message = "Unable to save todos: localStorage quota exceeded") {
    super(message);
    this.name = "StorageFullError";
  }
}

export class TodoNotFoundError extends Error {
  constructor(message = "Todo not found") {
    super(message);
    this.name = "TodoNotFoundError";
  }
}

const isQuotaExceededError = (error: unknown): boolean =>
  error instanceof DOMException &&
  (error.code === 22 ||
    error.code === 1014 ||
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED");

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
    if (isQuotaExceededError(error)) {
      throw new StorageFullError();
    }

    throw error;
  }
};

export const deleteTodo = (id: string): void => {
  const todos = getTodos();
  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1) {
    throw new TodoNotFoundError();
  }

  const updatedTodos = [...todos.slice(0, index), ...todos.slice(index + 1)];
  saveTodos(updatedTodos);
};
