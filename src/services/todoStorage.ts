import type { Todo } from "@/src/types/todo";

const STORAGE_KEY = "todos";
const MAX_TODO_TITLE_LENGTH = 300;

/**
 * Error thrown when trying to persist data and browser storage quota is exceeded.
 */
export class StorageFullError extends Error {
  constructor(message = "Unable to save todos: localStorage quota exceeded") {
    super(message);
    this.name = "StorageFullError";
  }
}

/**
 * Error thrown when a todo title is invalid.
 */
export class InvalidTodoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTodoError";
  }
}

const isQuotaExceededError = (error: unknown): boolean => {
  return (
    error instanceof DOMException &&
    (error.code === 22 ||
      error.code === 1014 ||
      error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
};

export const getTodos = (): Todo[] => {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

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

export const addTodo = (title: string): Todo => {
  const trimmedTitle = title.trim();

  if (trimmedTitle.length === 0) {
    throw new InvalidTodoError("Todo title cannot be empty");
  }

  if (trimmedTitle.length > MAX_TODO_TITLE_LENGTH) {
    throw new InvalidTodoError(
      `Todo title cannot exceed ${MAX_TODO_TITLE_LENGTH} characters`,
    );
  }

  const newTodo: Todo = {
    id: crypto.randomUUID(),
    title: trimmedTitle,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  const existingTodos = getTodos();
  saveTodos([newTodo, ...existingTodos]);

  return newTodo;
};
