import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import AddTodo from "./AddTodo";

afterEach(() => {
  cleanup();
});

describe("AddTodo", () => {
  it("renders input and button", () => {
    render(<AddTodo onAdd={vi.fn()} />);

    expect(screen.getByPlaceholderText("Add a new todo...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("calls onAdd with trimmed text on button click", () => {
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText("Todo title"), {
      target: { value: "   Buy milk   " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(onAdd).toHaveBeenCalledWith("Buy milk");
  });

  it("calls onAdd on Enter key press", () => {
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByLabelText("Todo title");
    fireEvent.change(input, { target: { value: "Walk dog" } });
    fireEvent.submit(input.closest("form")!);

    expect(onAdd).toHaveBeenCalledWith("Walk dog");
  });

  it("does not call onAdd for empty input", () => {
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it("does not call onAdd for whitespace-only input", () => {
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText("Todo title"), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it("clears input after calling onAdd", () => {
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByLabelText("Todo title") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Read book" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(input.value).toBe("");
  });

  it("shows character counter when input length > 250", () => {
    render(<AddTodo onAdd={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Todo title"), {
      target: { value: "a".repeat(251) },
    });

    expect(screen.getByText("251/300")).toBeInTheDocument();
  });

  it("shows error message when error prop provided", () => {
    render(<AddTodo onAdd={vi.fn()} error="Storage is full" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Storage is full");
  });

  it("does not clear input when error prop is set", () => {
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} error="Storage is full" />);

    const input = screen.getByLabelText("Todo title") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Keep this" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(onAdd).toHaveBeenCalledWith("Keep this");
    expect(input.value).toBe("Keep this");
  });
});
