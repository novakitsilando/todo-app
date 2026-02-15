import type { Todo } from "@/src/types/todo";

const STORAGE_KEY = "todos";

export class StorageFullError extends Error {
  constructor(message = "Unable to save todos: localStorage quota exceeded") {
    super(message);
    this.name = "StorageFullError";
  }
}

export class InvalidTodoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTodoError";
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

const validateTitle = (title: string): string => {
  const trimmed = title.trim();
  if (!trimmed) throw new InvalidTodoError("Todo title cannot be empty");
  if (trimmed.length > 300) throw new InvalidTodoError("Todo title cannot exceed 300 characters");
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
    if (isQuotaExceededError(error)) throw new StorageFullError();
    throw error;
  }
};

export const updateTodo = (id: string, newTitle: string): Todo => {
  const title = validateTitle(newTitle);
  const todos = getTodos();
  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1) throw new TodoNotFoundError();

  const updatedTodo: Todo = { ...todos[index], title };
  const updatedTodos = [...todos];
  updatedTodos[index] = updatedTodo;
  saveTodos(updatedTodos);

  return updatedTodo;
};
