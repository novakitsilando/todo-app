import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getTodos,
  saveTodos,
  StorageFullError,
  TodoNotFoundError,
  toggleTodo,
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
  title: "Todo",
  completed: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("toggleTodo", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("localStorage", new LocalStorageMock());
  });

  it("toggles incomplete todo to complete", () => {
    saveTodos([makeTodo({ id: "a", completed: false })]);

    const updated = toggleTodo("a");

    expect(updated.completed).toBe(true);
  });

  it("toggles complete todo back to incomplete", () => {
    saveTodos([makeTodo({ id: "a", completed: true })]);

    const updated = toggleTodo("a");

    expect(updated.completed).toBe(false);
  });

  it("persists updated state to localStorage", () => {
    saveTodos([makeTodo({ id: "a", completed: false })]);

    toggleTodo("a");

    expect(getTodos()[0].completed).toBe(true);
  });

  it("keeps other todos unchanged", () => {
    const first = makeTodo({ id: "a", title: "First", completed: false });
    const second = makeTodo({ id: "b", title: "Second", completed: true });
    saveTodos([first, second]);

    toggleTodo("a");

    const todos = getTodos();
    expect(todos[0].completed).toBe(true);
    expect(todos[1]).toEqual(second);
  });

  it("throws TodoNotFoundError for non-existent ID", () => {
    saveTodos([makeTodo({ id: "a" })]);

    expect(() => toggleTodo("missing")).toThrow(TodoNotFoundError);
  });

  it("handles rapid toggles on same todo correctly", () => {
    saveTodos([makeTodo({ id: "a", completed: false })]);

    toggleTodo("a");
    toggleTodo("a");
    toggleTodo("a");

    expect(getTodos()[0].completed).toBe(true);
  });

  it("throws StorageFullError on quota exceeded", () => {
    saveTodos([makeTodo({ id: "a", completed: false })]);
    const quotaError = new DOMException("quota exceeded", "QuotaExceededError");

    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw quotaError;
    });

    expect(() => toggleTodo("a")).toThrow(StorageFullError);
  });
});
