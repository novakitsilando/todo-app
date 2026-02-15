<<<<<<< HEAD
/**
 * Represents a single todo item in the application.
 */
export interface Todo {
  /**
   * Unique identifier for a todo item (generated with crypto.randomUUID()).
   */
  id: string;

  /**
   * User-provided todo title, trimmed and limited to 300 characters.
   */
  title: string;

  /**
   * Completion state of the todo item.
   * Defaults to false when a new todo is created.
   */
  completed: boolean;

  /**
   * Creation timestamp in ISO 8601 string format.
   */
=======
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
>>>>>>> b4c7c5c (feat: integrate AddTodo with localStorage on main page (#10))
  createdAt: string;
}
