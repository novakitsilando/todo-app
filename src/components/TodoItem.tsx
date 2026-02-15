"use client";

import type { Todo } from "@/src/types/todo";

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  onStartEdit: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onCancelEdit: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  error?: string | null;
}

export default function TodoItem({ todo }: TodoItemProps) {
  return <li>{todo.title}</li>;
}

export type { TodoItemProps };
