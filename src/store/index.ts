import { makeAutoObservable } from "mobx";
import { Temporal } from "@js-temporal/polyfill";
import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";

export type TodoStatus = "active" | "in_progress" | "completed";

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  order: number;
}

class TodoStore {
  todos: TodoItem[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadTodos();
  }

  private loadTodos() {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
    }
  }

  private saveTodos() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  addTodo(todo: Omit<TodoItem, "id" | "status" | "createdAt" | "updatedAt">) {
    const now = Temporal.Now.plainDateTimeISO().toString();
    const newTodo: TodoItem = {
      ...todo,
      id: crypto.randomUUID(),
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    this.todos.push(newTodo);
    this.saveTodos();
  }

  editTodo(todo: TodoItem) {
    const index = this.todos.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      this.todos[index] = {
        ...todo,
        updatedAt: Temporal.Now.plainDateTimeISO().toString(),
      };
      this.saveTodos();
    }
  }

  deleteTodo(id: string) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.saveTodos();
  }

  updateTodoStatus(id: string, status: TodoStatus) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.status = status;
      todo.updatedAt = Temporal.Now.plainDateTimeISO().toString();
      this.saveTodos();
    }
  }
}

export const store = new TodoStore();

export function useStore(): TodoStore {
  return useContext(MobXProviderContext).store;
} 