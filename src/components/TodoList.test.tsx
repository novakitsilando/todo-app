import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import TodoList from "./TodoList";
import type { Todo } from "@/src/types/todo";

const capturedProps: Array<Record<string, unknown>> = [];

vi.mock("./TodoItem", () => ({
  default: (props: Record<string, unknown>) => {
    capturedProps.push(props);
    return <li data-testid="todo-item">{(props.todo as Todo).title}</li>;
  },
}));

afterEach(() => {
  cleanup();
  capturedProps.length = 0;
});

const baseProps = {
  editingId: null,
  onStartEdit: vi.fn(),
  onEdit: vi.fn(),
  onCancelEdit: vi.fn(),
  onToggle: vi.fn(),
  onDelete: vi.fn(),
  editError: null,
};

const todos: Todo[] = [
  { id: "1", title: "First", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", title: "Second", completed: true, createdAt: "2026-01-02T00:00:00.000Z" },
];

describe("TodoList", () => {
  it("renders list of todos", () => {
    render(<TodoList {...baseProps} todos={todos} />);

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("renders empty state message when todos array is empty", () => {
    render(<TodoList {...baseProps} todos={[]} />);

    expect(screen.getByText("No todos yet — add one above!")).toBeInTheDocument();
  });

  it("renders correct number of TodoItem components", () => {
    render(<TodoList {...baseProps} todos={todos} />);

    expect(screen.getAllByTestId("todo-item")).toHaveLength(2);
  });

  it("passes correct props to each TodoItem", () => {
    render(<TodoList {...baseProps} todos={todos} editingId="2" editError="Storage full" />);

    expect(capturedProps).toHaveLength(2);
    expect(capturedProps[0].todo).toEqual(todos[0]);
    expect(capturedProps[0].isEditing).toBe(false);
    expect(capturedProps[0].error).toBeNull();

    expect(capturedProps[1].todo).toEqual(todos[1]);
    expect(capturedProps[1].isEditing).toBe(true);
    expect(capturedProps[1].error).toBe("Storage full");
  });

  it("renders todos in array order", () => {
    render(<TodoList {...baseProps} todos={todos} />);

    const items = screen.getAllByTestId("todo-item");
    expect(items[0]).toHaveTextContent("First");
    expect(items[1]).toHaveTextContent("Second");
  });
});
