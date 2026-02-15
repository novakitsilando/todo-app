import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  StorageFullError,
  TodoNotFoundError,
  InvalidTodoError,
  updateTodo,
  saveTodos,
  getTodos,
} from "./todoStorage";
import type { Todo } from "@/src/types/todo";

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

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: "1",
  title: "First",
  completed: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("updateTodo", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("localStorage", new LocalStorageMock());
  });

  it("updates title for existing todo", () => {
    saveTodos([makeTodo({ id: "a", title: "Old" })]);

    const updated = updateTodo("a", "New");

    expect(updated.title).toBe("New");
    expect(getTodos()[0].title).toBe("New");
  });

  it("trims whitespace from new title", () => {
    saveTodos([makeTodo({ id: "a", title: "Old" })]);

    const updated = updateTodo("a", "   Trimmed   ");

    expect(updated.title).toBe("Trimmed");
    expect(getTodos()[0].title).toBe("Trimmed");
  });

  it("rejects empty string", () => {
    saveTodos([makeTodo({ id: "a" })]);

    expect(() => updateTodo("a", "")).toThrow(InvalidTodoError);
  });

  it("rejects whitespace-only string", () => {
    saveTodos([makeTodo({ id: "a" })]);

    expect(() => updateTodo("a", "   ")).toThrow(InvalidTodoError);
  });

  it("rejects title longer than 300 chars", () => {
    saveTodos([makeTodo({ id: "a" })]);

    expect(() => updateTodo("a", "a".repeat(301))).toThrow(InvalidTodoError);
  });

  it("throws TodoNotFoundError for non-existent ID", () => {
    saveTodos([makeTodo({ id: "a" })]);

    expect(() => updateTodo("missing", "New")).toThrow(TodoNotFoundError);
  });

  it("throws StorageFullError on quota exceeded", () => {
    saveTodos([makeTodo({ id: "a" })]);
    const quotaError = new DOMException("quota exceeded", "QuotaExceededError");

    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw quotaError;
    });

    expect(() => updateTodo("a", "New")).toThrow(StorageFullError);
  });

  it("keeps other todos unchanged", () => {
    const first = makeTodo({ id: "a", title: "First" });
    const second = makeTodo({ id: "b", title: "Second" });
    saveTodos([first, second]);

    updateTodo("a", "Updated First");

    const todos = getTodos();
    expect(todos[0].title).toBe("Updated First");
    expect(todos[1]).toEqual(second);
  });
});
