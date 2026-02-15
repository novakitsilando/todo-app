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

describe("delete integration", () => {
  it("deletes a todo and removes it from list", () => {
    seedTodos([
      { id: "1", title: "First", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "2", title: "Second", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
    ]);

    render(<Home />);
    fireEvent.click(screen.getAllByLabelText("Delete todo")[0]);

    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("delete persists across refresh", () => {
    seedTodos([
      { id: "1", title: "First", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "2", title: "Second", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
    ]);

    const first = render(<Home />);
    fireEvent.click(screen.getAllByLabelText("Delete todo")[0]);
    first.unmount();

    render(<Home />);
    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("deleting todo in edit mode removes it and exits edit", () => {
    seedTodos([
      { id: "1", title: "First", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
    ]);

    render(<Home />);
    fireEvent.click(screen.getByLabelText("Edit todo"));
    expect(screen.getByLabelText("Edit todo title")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Delete todo"));

    expect(screen.queryByLabelText("Edit todo title")).not.toBeInTheDocument();
    expect(screen.getByText("No todos yet — add one above!")).toBeInTheDocument();
  });

  it("shows empty state when last todo is deleted", () => {
    seedTodos([
      { id: "1", title: "Only", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
    ]);

    render(<Home />);
    fireEvent.click(screen.getByLabelText("Delete todo"));

    expect(screen.getByText("No todos yet — add one above!")).toBeInTheDocument();
  });

  it("rapid sequential deletes all succeed", () => {
    seedTodos([
      { id: "1", title: "One", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "2", title: "Two", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "3", title: "Three", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
    ]);

    render(<Home />);

    fireEvent.click(screen.getAllByLabelText("Delete todo")[0]);
    fireEvent.click(screen.getAllByLabelText("Delete todo")[0]);
    fireEvent.click(screen.getAllByLabelText("Delete todo")[0]);

    expect(screen.getByText("No todos yet — add one above!")).toBeInTheDocument();
  });
});
