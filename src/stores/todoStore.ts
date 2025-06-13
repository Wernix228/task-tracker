import { makeAutoObservable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import Fuse from 'fuse.js';
import { Temporal } from '@js-temporal/polyfill';

export class TodoStore {
  todos: TodoItem[] = [];
  filter: TodoFilter = { status: 'all', search: '' };

  constructor() {
    makeAutoObservable(this);
  }

  get filteredTodos() {
    let filtered = this.todos;

    // Filter by status
    if (this.filter.status !== 'all') {
      filtered = filtered.filter(todo => todo.status === this.filter.status);
    }

    // Search using Fuse.js
    if (this.filter.search) {
      const fuse = new Fuse(filtered, {
        keys: ['title', 'description'],
        threshold: 0.3,
      });
      filtered = fuse.search(this.filter.search).map(result => result.item);
    }

    // Sort by order
    return filtered.sort((a, b) => a.order - b.order);
  }

  addTodo(todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt' | 'order'>) {
    const now = Temporal.Now.plainDateTimeISO().toString();
    const newTodo: TodoItem = {
      ...todo,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      order: this.todos.length,
    };
    this.todos.push(newTodo);
  }

  updateTodo(id: string, updates: Partial<TodoItem>) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      Object.assign(todo, {
        ...updates,
        updatedAt: Temporal.Now.plainDateTimeISO().toString(),
      });
    }
  }

  deleteTodo(id: string) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      // Reorder remaining todos
      this.todos.forEach((todo, idx) => {
        todo.order = idx;
      });
    }
  }

  setStatus(id: string, status: TodoStatus) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.status = status;
      todo.updatedAt = Temporal.Now.plainDateTimeISO().toString();
    }
  }

  setFilter(filter: TodoFilter) {
    this.filter = filter;
  }

  reorderTodos(startIndex: number, endIndex: number) {
    const [removed] = this.todos.splice(startIndex, 1);
    this.todos.splice(endIndex, 0, removed);
    
    // Update order for all todos
    this.todos.forEach((todo, index) => {
      todo.order = index;
    });
  }
} 