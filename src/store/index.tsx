import { makeAutoObservable } from "mobx";
import { Temporal } from "@js-temporal/polyfill";
import React, { createContext, useContext } from "react";

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
    try {
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        this.todos = JSON.parse(savedTodos);
        console.log("Loaded todos:", this.todos.length);
      }
    } catch (error) {
      console.error("Error loading todos:", error);
      this.todos = [];
    }
  }

  private saveTodos() {
    try {
      localStorage.setItem("todos", JSON.stringify(this.todos));
      console.log("Saved todos:", this.todos.length);
    } catch (error) {
      console.error("Error saving todos:", error);
    }
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
    console.log("Added todo:", newTodo.title);
  }

  editTodo(todo: TodoItem) {
    const index = this.todos.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      this.todos[index] = {
        ...todo,
        updatedAt: Temporal.Now.plainDateTimeISO().toString(),
      };
      this.saveTodos();
      console.log("Edited todo:", todo.title);
    } else {
      console.error("Todo not found for editing:", todo.id);
    }
  }

  deleteTodo(id: string) {
    const todoToDelete = this.todos.find(todo => todo.id === id);
    if (todoToDelete) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      this.saveTodos();
      console.log("Deleted todo:", todoToDelete.title);
    } else {
      console.error("Todo not found for deletion:", id);
    }
  }

  updateTodoStatus(id: string, status: TodoStatus) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.status = status;
      todo.updatedAt = Temporal.Now.plainDateTimeISO().toString();
      this.saveTodos();
      console.log("Updated todo status:", todo.title, "->", status);
    } else {
      console.error("Todo not found for status update:", id);
    }
  }

  getTodosByStatus(status: TodoStatus) {
    return this.todos.filter(todo => todo.status === status);
  }

  getTodoById(id: string) {
    return this.todos.find(todo => todo.id === id);
  }

  get totalTodos() {
    return this.todos.length;
  }

  get completedTodos() {
    return this.todos.filter(todo => todo.status === 'completed').length;
  }

  get activeTodos() {
    return this.todos.filter(todo => todo.status === 'active').length;
  }
}

export const store = new TodoStore();

export const StoreContext = createContext<TodoStore | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): TodoStore {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
} 