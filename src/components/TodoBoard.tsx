import { Box, Grid, GridItem, Heading, useColorMode, VStack } from "@chakra-ui/react";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { TodoItem } from "./TodoItem";
import { observer } from "mobx-react-lite";
import { useStore } from "../store";

const COLUMNS: { status: TodoStatus; title: string }[] = [
  { status: "active", title: "Active" },
  { status: "in_progress", title: "In Progress" },
  { status: "completed", title: "Completed" },
];

interface TodoListProps {
  status: TodoStatus;
}

const TodoList = observer(({ status }: TodoListProps) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });
  const { colorMode } = useColorMode();
  const store = useStore();

  const todos = store.todos.filter(todo => todo.status === status);

  return (
    <Box
      ref={setNodeRef}
      bg={colorMode === "light" ? "gray.50" : "gray.800"}
      borderRadius="lg"
      p={4}
      minH="200px"
      borderWidth="1px"
      borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
    >
      <VStack spacing={2} align="stretch">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onEdit={store.editTodo}
            onDelete={store.deleteTodo}
            onStatusChange={store.updateTodoStatus}
          />
        ))}
      </VStack>
    </Box>
  );
});

export const TodoBoard = observer(() => {
  const { colorMode } = useColorMode();
  const store = useStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      store.updateTodoStatus(active.id as string, over.id as TodoStatus);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={6}
        p={6}
        bg={colorMode === "light" ? "white" : "gray.900"}
        borderRadius="xl"
        boxShadow="lg"
      >
        {COLUMNS.map(({ status, title }) => (
          <GridItem key={status}>
            <Heading
              size="md"
              mb={4}
              color={colorMode === "light" ? "gray.700" : "white"}
            >
              {title}
            </Heading>
            <TodoList status={status} />
          </GridItem>
        ))}
      </Grid>
    </DndContext>
  );
}); 