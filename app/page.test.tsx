import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Home from "./page";
import * as storage from "@/src/services/todoStorage";
import type { Todo } from "@/src/types/todo";

const seedTodos = (todos: Todo[]) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  localStorage.clear();
});

describe("inline edit integration", () => {
  it("edits a todo and updates title in list", () => {
    seedTodos([
      { id: "1", title: "Old title", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
    ]);

    render(<Home />);

    fireEvent.click(screen.getByLabelText("Edit todo"));
    fireEvent.change(screen.getByLabelText("Edit todo title"), {
      target: { value: "New title" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("New title")).toBeInTheDocument();
  });

  it("edit persists across refresh", () => {
    seedTodos([
      { id: "1", title: "Before", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
    ]);

    const first = render(<Home />);
    fireEvent.click(screen.getByLabelText("Edit todo"));
    fireEvent.change(screen.getByLabelText("Edit todo title"), {
      target: { value: "After" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("After")).toBeInTheDocument();

    first.unmount();
    render(<Home />);
    expect(screen.getByText("After")).toBeInTheDocument();
  });

  it("starting edit on second todo auto-cancels first", () => {
    seedTodos([
      { id: "1", title: "First", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "2", title: "Second", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
    ]);

    render(<Home />);

    fireEvent.click(screen.getAllByLabelText("Edit todo")[0]);
    expect(screen.getByDisplayValue("First")).toBeInTheDocument();

    fireEvent.click(screen.getAllByLabelText("Edit todo")[0]);

    expect(screen.queryByDisplayValue("First")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("Second")).toBeInTheDocument();
  });

  it("shows storage full error inline", () => {
    seedTodos([
      { id: "1", title: "Title", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
    ]);

    vi.spyOn(storage, "updateTodo").mockImplementation(() => {
      throw new storage.StorageFullError();
    });

    render(<Home />);

    fireEvent.click(screen.getByLabelText("Edit todo"));
    fireEvent.change(screen.getByLabelText("Edit todo title"), { target: { value: "Edited" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Storage is full");
  });

  it("clears error after successful edit", () => {
    seedTodos([
      { id: "1", title: "Title", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
    ]);

    const updateSpy = vi
      .spyOn(storage, "updateTodo")
      .mockImplementationOnce(() => {
        throw new storage.StorageFullError();
      })
      .mockImplementationOnce((id: string, newTitle: string) => ({
        id,
        title: newTitle,
        completed: false,
        createdAt: "2026-01-01T00:00:00.000Z",
      }));

    render(<Home />);

    fireEvent.click(screen.getByLabelText("Edit todo"));
    fireEvent.change(screen.getByLabelText("Edit todo title"), { target: { value: "Fail" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Edit todo title"), { target: { value: "Success" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(updateSpy).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
  });
});
