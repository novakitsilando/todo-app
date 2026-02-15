import type { Todo } from "./todo";

const validTodo: Todo = {
  id: crypto.randomUUID(),
  title: "Buy milk",
  completed: false,
  createdAt: new Date().toISOString(),
};

const alsoValidTodo = {
  id: "b6b9434f-a524-43fb-bf10-295198f68fdf",
  title: "Walk the dog",
  completed: true,
  createdAt: "2026-01-01T00:00:00.000Z",
} satisfies Todo;

void validTodo;
void alsoValidTodo;
