import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import TodoItem from "./TodoItem";
import type { Todo } from "@/src/types/todo";

afterEach(() => {
  cleanup();
});

const todo: Todo = {
  id: "todo-1",
  title: "Original title",
  completed: false,
  createdAt: "2026-01-01T00:00:00.000Z",
};

const makeProps = (overrides: Record<string, unknown> = {}) => ({
  todo,
  isEditing: false,
  onStartEdit: vi.fn(),
  onEdit: vi.fn(),
  onCancelEdit: vi.fn(),
  onToggle: vi.fn(),
  onDelete: vi.fn(),
  error: null,
  ...overrides,
});

describe("TodoItem", () => {
  it("renders todo title and action buttons", () => {
    const props = makeProps();
    render(<TodoItem {...props} />);

    expect(screen.getByText("Original title")).toBeInTheDocument();
    expect(screen.getByLabelText("Edit todo")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete todo")).toBeInTheDocument();
  });

  it("enters edit mode on pencil click (calls onStartEdit)", () => {
    const props = makeProps();
    render(<TodoItem {...props} />);

    fireEvent.click(screen.getByLabelText("Edit todo"));

    expect(props.onStartEdit).toHaveBeenCalledWith("todo-1");
  });

  it("pre-fills input with current title", () => {
    const props = makeProps({ isEditing: true });
    render(<TodoItem {...props} />);

    expect(screen.getByLabelText("Edit todo title")).toHaveValue("Original title");
  });

  it("calls onEdit with trimmed title on Enter", () => {
    const props = makeProps({ isEditing: true });
    render(<TodoItem {...props} />);

    const input = screen.getByLabelText("Edit todo title");
    fireEvent.change(input, { target: { value: "  Updated  " } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(props.onEdit).toHaveBeenCalledWith("todo-1", "Updated");
  });

  it("calls onEdit with trimmed title on Save click", () => {
    const props = makeProps({ isEditing: true });
    render(<TodoItem {...props} />);

    const input = screen.getByLabelText("Edit todo title");
    fireEvent.change(input, { target: { value: "  Updated  " } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(props.onEdit).toHaveBeenCalledWith("todo-1", "Updated");
  });

  it("calls onCancelEdit on Escape", () => {
    const props = makeProps({ isEditing: true });
    render(<TodoItem {...props} />);

    const input = screen.getByLabelText("Edit todo title");
    fireEvent.keyDown(input, { key: "Escape" });

    expect(props.onCancelEdit).toHaveBeenCalled();
  });

  it("calls onCancelEdit on Cancel click", () => {
    const props = makeProps({ isEditing: true });
    render(<TodoItem {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(props.onCancelEdit).toHaveBeenCalled();
  });

  it("does not call onEdit for empty input", () => {
    const props = makeProps({ isEditing: true });
    render(<TodoItem {...props} />);

    const input = screen.getByLabelText("Edit todo title");
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(props.onEdit).not.toHaveBeenCalled();
  });

  it("does not call onEdit for whitespace-only input", () => {
    const props = makeProps({ isEditing: true });
    render(<TodoItem {...props} />);

    const input = screen.getByLabelText("Edit todo title");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(props.onEdit).not.toHaveBeenCalled();
  });

  it("shows character counter when > 250 chars", () => {
    const props = makeProps({ isEditing: true });
    render(<TodoItem {...props} />);

    fireEvent.change(screen.getByLabelText("Edit todo title"), {
      target: { value: "a".repeat(251) },
    });

    expect(screen.getByText("251/300")).toBeInTheDocument();
  });

  it("shows error when error prop set", () => {
    const props = makeProps({ isEditing: true, error: "Storage full" });
    render(<TodoItem {...props} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Storage full");
  });
});
