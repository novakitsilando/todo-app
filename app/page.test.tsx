import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import Home from "./page";
import type { Todo } from "@/src/types/todo";

const seedTodos = (todos: Todo[]) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  localStorage.clear();
});

describe("toggle integration", () => {
  it("toggles todo to complete with visual style", () => {
    seedTodos([{ id: "1", title: "Task", completed: false, createdAt: "2026-01-01T00:00:00.000Z" }]);

    render(<Home />);
    fireEvent.click(screen.getByLabelText("Toggle Task"));

    const text = screen.getByText("Task");
    expect(text.className).toContain("line-through");
    expect(text.className).toContain("text-gray-500");
  });

  it("toggles complete todo back to incomplete", () => {
    seedTodos([{ id: "1", title: "Task", completed: true, createdAt: "2026-01-01T00:00:00.000Z" }]);

    render(<Home />);
    fireEvent.click(screen.getByLabelText("Toggle Task"));

    const text = screen.getByText("Task");
    expect(text.className).toContain("text-gray-900");
  });

  it("toggle persists across refresh", () => {
    seedTodos([{ id: "1", title: "Task", completed: false, createdAt: "2026-01-01T00:00:00.000Z" }]);

    const first = render(<Home />);
    fireEvent.click(screen.getByLabelText("Toggle Task"));
    first.unmount();

    render(<Home />);
    expect(screen.getByText("Task").className).toContain("line-through");
  });

  it("item position unchanged after toggle", () => {
    seedTodos([
      { id: "1", title: "First", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "2", title: "Second", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
    ]);

    render(<Home />);
    fireEvent.click(screen.getByLabelText("Toggle First"));

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("First");
    expect(items[1]).toHaveTextContent("Second");
  });

  it("toggle during edit mode does not affect edit text", () => {
    seedTodos([{ id: "1", title: "Task", completed: false, createdAt: "2026-01-01T00:00:00.000Z" }]);

    render(<Home />);
    fireEvent.click(screen.getByLabelText("Edit todo"));

    const input = screen.getByLabelText("Edit todo title");
    fireEvent.change(input, { target: { value: "Unsaved draft" } });
    fireEvent.click(screen.getByLabelText("Toggle Task"));

    expect(screen.getByLabelText("Edit todo title")).toHaveValue("Unsaved draft");
  });

  it("rapid toggles end with correct final state", () => {
    seedTodos([{ id: "1", title: "Task", completed: false, createdAt: "2026-01-01T00:00:00.000Z" }]);

    render(<Home />);
    const checkbox = screen.getByLabelText("Toggle Task") as HTMLInputElement;

    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(true);
  });
});
