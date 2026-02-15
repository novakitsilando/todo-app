import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  addTodo,
  getTodos,
  InvalidTodoError,
  saveTodos,
  StorageFullError,
} from "./todoStorage";

class LocalStorageMock {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  clear(): void {
    this.store.clear();
  }
}

const makeTodo = (
  overrides: Partial<{
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
  }> = {},
) => ({
  id: "1",
  title: "Sample",
  completed: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("todoStorage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("localStorage", new LocalStorageMock());
  });

  it("getTodos returns empty array when localStorage is empty", () => {
    expect(getTodos()).toEqual([]);
  });

  it("getTodos returns parsed todos when data exists", () => {
    const todos = [makeTodo()];
    localStorage.setItem("todos", JSON.stringify(todos));

    expect(getTodos()).toEqual(todos);
  });

  it("getTodos returns empty array when localStorage has corrupted JSON", () => {
    localStorage.setItem("todos", "{bad-json");

    expect(getTodos()).toEqual([]);
  });

  it("addTodo creates todo with correct fields", () => {
    const randomUuid = "uuid-123";
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue(randomUuid);

    const todo = addTodo("Buy milk");

    expect(todo.id).toBe(randomUuid);
    expect(todo.title).toBe("Buy milk");
    expect(todo.completed).toBe(false);
    expect(new Date(todo.createdAt).toISOString()).toBe(todo.createdAt);
  });

  it("addTodo trims whitespace", () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("uuid-1");

    const todo = addTodo("   Walk dog   ");

    expect(todo.title).toBe("Walk dog");
  });

  it("addTodo rejects empty string", () => {
    expect(() => addTodo("")).toThrow(InvalidTodoError);
  });

  it("addTodo rejects whitespace-only string", () => {
    expect(() => addTodo("   ")).toThrow(InvalidTodoError);
  });

  it("addTodo rejects titles longer than 300 characters", () => {
    expect(() => addTodo("a".repeat(301))).toThrow(InvalidTodoError);
  });

  it("addTodo prepends new todo to existing list", () => {
    const existing = makeTodo({ id: "older", title: "Older" });
    localStorage.setItem("todos", JSON.stringify([existing]));
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("new-id");

    const newTodo = addTodo("New");
    const saved = getTodos();

    expect(saved[0]).toMatchObject({ id: newTodo.id, title: "New" });
    expect(saved[1]).toEqual(existing);
  });

  it("saveTodos throws StorageFullError when quota exceeded", () => {
    const quotaError = new DOMException("quota exceeded", "QuotaExceededError");

    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw quotaError;
    });

    expect(() => saveTodos([makeTodo()])).toThrow(StorageFullError);
  });
});
