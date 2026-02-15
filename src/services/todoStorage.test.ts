import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteTodo, getTodos, saveTodos, TodoNotFoundError } from "./todoStorage";
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

describe("deleteTodo", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("localStorage", new LocalStorageMock());
  });

  it("deletes correct todo by ID", () => {
    saveTodos([makeTodo({ id: "a" }), makeTodo({ id: "b" })]);

    deleteTodo("a");

    expect(getTodos()).toEqual([makeTodo({ id: "b" })]);
  });

  it("keeps remaining todos unchanged and in original order", () => {
    const first = makeTodo({ id: "1", title: "First" });
    const second = makeTodo({ id: "2", title: "Second" });
    const third = makeTodo({ id: "3", title: "Third" });

    saveTodos([first, second, third]);

    deleteTodo("2");

    expect(getTodos()).toEqual([first, third]);
  });

  it("throws TodoNotFoundError for non-existent ID", () => {
    saveTodos([makeTodo({ id: "1" })]);

    expect(() => deleteTodo("missing")).toThrow(TodoNotFoundError);
  });

  it("deleting last todo results in empty array in localStorage", () => {
    saveTodos([makeTodo({ id: "1" })]);

    deleteTodo("1");

    expect(getTodos()).toEqual([]);
  });

  it("handles rapid sequential deletes correctly", () => {
    saveTodos([
      makeTodo({ id: "1", title: "One" }),
      makeTodo({ id: "2", title: "Two" }),
      makeTodo({ id: "3", title: "Three" }),
    ]);

    deleteTodo("1");
    deleteTodo("3");

    expect(getTodos()).toEqual([makeTodo({ id: "2", title: "Two" })]);
  });
});
