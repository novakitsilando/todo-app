import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import Home from "./page";
import type { Todo } from "@/src/types/todo";

const seed = (todos: Todo[]) => localStorage.setItem("todos", JSON.stringify(todos));

afterEach(() => cleanup());
beforeEach(() => localStorage.clear());

describe("main page assembly", () => {
  it("renders heading, AddTodo, and TodoList", () => {
    render(<Home />);
    expect(screen.getByText("Todo List")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add a new todo...")).toBeInTheDocument();
    expect(screen.getByText("No todos yet — add one above!")).toBeInTheDocument();
  });

  it("loads todos in createdAt descending order", () => {
    seed([
      { id: "1", title: "Older", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "2", title: "Newer", completed: false, createdAt: "2026-01-02T00:00:00.000Z" },
    ]);
    render(<Home />);
    const items = screen.getAllByTestId("todo-item");
    expect(items[0]).toHaveTextContent("Newer");
    expect(items[1]).toHaveTextContent("Older");
  });

  it("full CRUD flow: add edit toggle delete", () => {
    render(<Home />);
    fireEvent.change(screen.getByLabelText("Todo title"), { target: { value: "Task" } });
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Task")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Edit todo"));
    fireEvent.change(screen.getByLabelText("Edit todo title"), { target: { value: "Task edited" } });
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByText("Task edited")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Toggle Task edited"));
    expect(screen.getByText("Task edited").className).toContain("line-through");

    fireEvent.click(screen.getByLabelText("Delete todo"));
    expect(screen.getByText("No todos yet — add one above!")).toBeInTheDocument();
  });

  it("empty state shown on fresh load", () => {
    render(<Home />);
    expect(screen.getByText("No todos yet — add one above!")).toBeInTheDocument();
  });

  it("layout snapshot at 320 and 1024 widths", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 320 });
    const narrow = render(<Home />);
    expect(narrow.container.firstChild).toMatchSnapshot("layout-320");
    narrow.unmount();

    Object.defineProperty(window, "innerWidth", { writable: true, value: 1024 });
    const wide = render(<Home />);
    expect(wide.container.firstChild).toMatchSnapshot("layout-1024");
  });
});
