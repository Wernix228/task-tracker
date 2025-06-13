import { useQuery, useMutation } from "@tanstack/react-query";

const taskTemplate: TaskColumn[] = [
  {
    title: "Backlog",
    status: "0",
    tasks: [],
  },
  {
    title: "In Progress",
    status: "1",
    tasks: [],
  },
  {
    title: "Review",
    status: "2",
    tasks: [],
  },
  {
    title: "Done",
    status: "3",
    tasks: [],
  },
];

async function fetchTaskColumns(boardId?: string) {
  if (!localStorage) {
    console.error("error in retrieving local storage");
    return;
  }
  if (boardId) {
    const storedBoards = JSON.parse(
      localStorage.getItem("react-task-tracker-boards") ?? ""
    );

    const filtertedBoard = storedBoards.find(({ id }) => id === boardId);

    return filtertedBoard.taskColumns;
  }
  const storedTasks = localStorage?.getItem("task-tracker");
  const tasks = storedTasks ? JSON.parse(storedTasks) : taskTemplate;
  return tasks;
}

async function getTaskById(id: string) {
  const taskColumns: TaskColumn[] = await fetchTaskColumns();

  const foundTask = taskColumns
    .flatMap((taskColumn) => taskColumn.tasks)
    .find((task) => task.id === id);
  if (!foundTask) return {} as Task;
  return foundTask;
}

async function createTask(newTask: Task) {
  const taskColumns: TaskColumn[] = await fetchTaskColumns();

  const taskColumnToUpdate = taskColumns.find(
    (column) => column.status === newTask.status
  );
  if (!taskColumnToUpdate) return;

  const currentTaskColumns = taskColumns.filter(
    (col) => col.status !== newTask.status
  );

  const newColumn: TaskColumn = {
    title: taskColumnToUpdate.title,
    status: taskColumnToUpdate.status,
    tasks: [newTask, ...taskColumnToUpdate.tasks],
  };

  const updatedTasks = [...currentTaskColumns, newColumn];
  localStorage.setItem("task-tracker", JSON.stringify(updatedTasks));
  return updatedTasks;
}

async function updateTask(taskToUpdate: Task) {
  const taskColumns: TaskColumn[] = await fetchTaskColumns();
  const taskColumnToUpdate = taskColumns.find(
    (column) => column.status === taskToUpdate.status
  );

  if (!taskColumnToUpdate) {
    const newColumns = taskColumns.map((col) => ({
      ...col,
      tasks: col.tasks.filter((task) => task.id !== taskToUpdate.id),
    }));
    localStorage.setItem("task-tracker", JSON.stringify(newColumns));
    return newColumns;
  }

  const currentTaskColumns = taskColumns
    .filter((col) => col.status !== taskToUpdate.status)
    .map((column: TaskColumn) => ({
      ...column,
      tasks: column.tasks.filter((task) => task.id !== taskToUpdate.id),
    }));

  const currentColumnTasks = taskColumnToUpdate.tasks.filter(
    (task) => task.id !== taskToUpdate.id
  );
  const updatedColumn = {
    ...taskColumnToUpdate,
    tasks: [...currentColumnTasks, taskToUpdate],
  };

  const newColumns = [...currentTaskColumns, updatedColumn];
  localStorage.setItem("task-tracker", JSON.stringify(newColumns));
  return newColumns;
}

async function deleteTask(taskId: string) {
  const taskColumns: TaskColumn[] = await fetchTaskColumns();

  const columnToUpdate = taskColumns.find((col) =>
    col.tasks.map((t) => t.id).includes(taskId)
  );
  const oldTaskColumns = taskColumns.filter(
    (col) => col.status !== columnToUpdate?.status
  );

  const updatedColumn = {
    ...columnToUpdate,
    tasks: columnToUpdate?.tasks.filter((task) => task.id !== taskId),
  };

  const newTaskColumns = [...oldTaskColumns, updatedColumn];

  localStorage.setItem("task-tracker", JSON.stringify(newTaskColumns));
  return newTaskColumns;
}

export function useTasks(callback?: () => void, boardId?: string) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["task-tracker"],
    queryFn: () => fetchTaskColumns(boardId),
    initialData: taskTemplate,
  });

  function successHandler() {
    if (callback) {
      callback();
    }
    refetch();
  }

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: successHandler,
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: successHandler,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: successHandler,
  });

  return {
    taskColumns: data as TaskColumn[],
    error,
    isLoading,
    getTaskById: (id: string) => getTaskById(id),
    createTask: (newTask: Task) => createTaskMutation.mutate(newTask),
    updateTask: (taskToMutate: Task) => updateTaskMutation.mutate(taskToMutate),
    deleteTask: (taskId: string) => deleteTaskMutation.mutate(taskId),
  };
}

