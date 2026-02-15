import type { Todo } from "@/src/types/todo";

const STORAGE_KEY = "todos";
<<<<<<< HEAD
const MAX_TODO_TITLE_LENGTH = 300;

/**
 * Error thrown when trying to persist data and browser storage quota is exceeded.
 */
=======

>>>>>>> b4c7c5c (feat: integrate AddTodo with localStorage on main page (#10))
export class StorageFullError extends Error {
  constructor(message = "Unable to save todos: localStorage quota exceeded") {
    super(message);
    this.name = "StorageFullError";
  }
}

<<<<<<< HEAD
/**
 * Error thrown when a todo title is invalid.
 */
=======
>>>>>>> b4c7c5c (feat: integrate AddTodo with localStorage on main page (#10))
export class InvalidTodoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTodoError";
  }
}

<<<<<<< HEAD
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
=======
const isQuotaExceededError = (error: unknown): boolean =>
  error instanceof DOMException &&
  (error.code === 22 ||
    error.code === 1014 ||
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED");

export const getTodos = (): Todo[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
>>>>>>> b4c7c5c (feat: integrate AddTodo with localStorage on main page (#10))

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
<<<<<<< HEAD
    if (isQuotaExceededError(error)) {
      throw new StorageFullError();
    }

=======
    if (isQuotaExceededError(error)) throw new StorageFullError();
>>>>>>> b4c7c5c (feat: integrate AddTodo with localStorage on main page (#10))
    throw error;
  }
};

export const addTodo = (title: string): Todo => {
  const trimmedTitle = title.trim();

<<<<<<< HEAD
  if (trimmedTitle.length === 0) {
    throw new InvalidTodoError("Todo title cannot be empty");
  }

  if (trimmedTitle.length > MAX_TODO_TITLE_LENGTH) {
    throw new InvalidTodoError(
      `Todo title cannot exceed ${MAX_TODO_TITLE_LENGTH} characters`,
    );
  }

  const newTodo: Todo = {
=======
  if (!trimmedTitle) throw new InvalidTodoError("Todo title cannot be empty");
  if (trimmedTitle.length > 300) {
    throw new InvalidTodoError("Todo title cannot exceed 300 characters");
  }

  const todo: Todo = {
>>>>>>> b4c7c5c (feat: integrate AddTodo with localStorage on main page (#10))
    id: crypto.randomUUID(),
    title: trimmedTitle,
    completed: false,
    createdAt: new Date().toISOString(),
  };

<<<<<<< HEAD
  const existingTodos = getTodos();
  saveTodos([newTodo, ...existingTodos]);

  return newTodo;
=======
  saveTodos([todo, ...getTodos()]);
  return todo;
>>>>>>> b4c7c5c (feat: integrate AddTodo with localStorage on main page (#10))
};
