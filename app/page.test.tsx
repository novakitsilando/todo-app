import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Home from "./page";
import * as storage from "@/src/services/todoStorage";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  localStorage.clear();
});

describe("Home page integration", () => {
  it("adds a todo and shows it in the list", () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("id-1");

    render(<Home />);

    fireEvent.change(screen.getByLabelText("Todo title"), {
      target: { value: "Buy milk" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("persists todos across refresh", () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("id-2");

    const first = render(<Home />);
    fireEvent.change(screen.getByLabelText("Todo title"), {
      target: { value: "Walk dog" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByText("Walk dog")).toBeInTheDocument();

    first.unmount();
    render(<Home />);

    expect(screen.getByText("Walk dog")).toBeInTheDocument();
  });

  it("shows inline storage full error", () => {
    vi.spyOn(storage, "addTodo").mockImplementation(() => {
      throw new storage.StorageFullError();
    });

    render(<Home />);

    fireEvent.change(screen.getByLabelText("Todo title"), {
      target: { value: "Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Storage is full");
  });

  it("clears error after next successful add", () => {
    const addTodoSpy = vi
      .spyOn(storage, "addTodo")
      .mockImplementationOnce(() => {
        throw new storage.StorageFullError();
      })
      .mockImplementationOnce((title: string) => ({
        id: "ok-id",
        title,
        completed: false,
        createdAt: new Date().toISOString(),
      }));

    render(<Home />);

    fireEvent.change(screen.getByLabelText("Todo title"), {
      target: { value: "First" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Todo title"), {
      target: { value: "Second" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(addTodoSpy).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
