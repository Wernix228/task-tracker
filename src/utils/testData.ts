import { TodoItem } from "../store";

export const sampleTodos: Omit<TodoItem, "id" | "status" | "createdAt" | "updatedAt">[] = [
  {
    title: "Изучить React Hooks",
    description: "Изучить useState, useEffect, useContext и другие хуки",
    dueDate: "2024-01-15",
    order: 0,
  },
  {
    title: "Настроить MobX Store",
    description: "Создать store для управления состоянием приложения",
    dueDate: "2024-01-20",
    order: 1,
  },
  {
    title: "Стилизация с Chakra UI",
    description: "Применить компоненты Chakra UI для красивого интерфейса",
    dueDate: "2024-01-25",
    order: 2,
  },
  {
    title: "Добавить Drag & Drop",
    description: "Реализовать перетаскивание задач между колонками",
    dueDate: "2024-01-30",
    order: 3,
  },
  {
    title: "Тестирование приложения",
    description: "Написать unit тесты для всех компонентов",
    dueDate: "2024-02-05",
    order: 4,
  },
];

export const loadSampleData = (store: any) => {
  if (store.todos.length === 0) {
    sampleTodos.forEach(todo => {
      store.addTodo(todo);
    });
    console.log("Loaded sample data");
  }
}; 