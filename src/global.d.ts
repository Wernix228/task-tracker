type Task = {
  description: any;
	id: string
	title: string;
	createdDate?: string;
	dueDate?: string;
	editedDate?: string;
	details?: string;
	priority: string;
	status?: string;
};

interface TaskColumn {
	title: string;
	status: string;
	tasks: Task[];
}

interface TaskBoard {
	title: string;
	id: string;
	taskColumns: TaskColumn[]
}

interface WorkItem {
  id: string;
  name: string;
  content: string;
  status: WorkItemStatus;
  priority: PriorityLevel;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
  assignee?: string;
}

type WorkItemStatus = 'backlog' | 'in_progress' | 'review' | 'done';

type PriorityLevel = 'low' | 'medium' | 'high';

interface WorkItemColumn {
  id: string;
  title: string;
  status: WorkItemStatus;
  items: WorkItem[];
}

interface WorkItemState {
  columns: WorkItemColumn[];
  selectedItem?: WorkItem;
  filters: {
    search: string;
    priority?: PriorityLevel;
    tags?: string[];
  };
}

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
  order: number;
}

type TodoStatus = 'active' | 'in_progress' | 'completed';

interface TodoStore {
  todos: TodoItem[];
  filter: TodoFilter;
  addTodo: (todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  setStatus: (id: string, status: TodoStatus) => void;
  setFilter: (filter: TodoFilter) => void;
  reorderTodos: (startIndex: number, endIndex: number) => void;
  reorderTodoToEnd: (id: string, status: TodoStatus) => void;
}

interface TodoFilter {
  status: TodoStatus | 'all';
  search: string;
}

interface TodoFormData {
  title: string;
  description?: string;
  dueDate?: string;
}