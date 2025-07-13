import { Box, Grid, GridItem, Heading, useColorMode, VStack, Text, Badge, HStack, Stat, StatLabel, StatNumber, StatGroup } from "@chakra-ui/react";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { TodoItem } from "./TodoItem";
import { SearchBar } from "./SearchBar";
import { observer } from "mobx-react-lite";
import { useStore } from "../store";
import { useState, useMemo } from "react";

const COLUMNS: { status: TodoStatus; title: string }[] = [
  { status: "active", title: "Active" },
  { status: "in_progress", title: "In Progress" },
  { status: "completed", title: "Completed" },
];

interface TodoListProps {
  status: TodoStatus;
  searchTerm: string;
}

const TodoList = observer(({ status, searchTerm }: TodoListProps) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });
  const { colorMode } = useColorMode();
  const store = useStore();

  const filteredTodos = useMemo(() => {
    const todos = store.todos.filter(todo => todo.status === status);
    if (!searchTerm.trim()) return todos;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return todos.filter(todo => 
      todo.title.toLowerCase().includes(lowerSearchTerm) ||
      (todo.description && todo.description.toLowerCase().includes(lowerSearchTerm))
    );
  }, [store.todos, status, searchTerm]);

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
        {filteredTodos.length === 0 ? (
          <Box
            textAlign="center"
            py={8}
            color={colorMode === "light" ? "gray.500" : "gray.400"}
          >
            <Text fontSize="sm">
              {searchTerm.trim() ? "No tasks found" : "No tasks yet"}
            </Text>
          </Box>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEdit={store.editTodo}
              onDelete={store.deleteTodo}
              onStatusChange={store.updateTodoStatus}
            />
          ))
        )}
      </VStack>
    </Box>
  );
});

const TaskStats = observer(() => {
  const { colorMode } = useColorMode();
  const store = useStore();

  return (
    <Box
      mb={6}
      p={4}
      bg={colorMode === "light" ? "white" : "gray.800"}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
    >
      <StatGroup>
        <Stat>
          <StatLabel>Total Tasks</StatLabel>
          <StatNumber>{store.totalTodos}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Active</StatLabel>
          <StatNumber color="blue.500">{store.activeTodos}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>In Progress</StatLabel>
          <StatNumber color="orange.500">{store.getTodosByStatus("in_progress").length}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Completed</StatLabel>
          <StatNumber color="green.500">{store.completedTodos}</StatNumber>
        </Stat>
      </StatGroup>
    </Box>
  );
});

export const TodoBoard = observer(() => {
  const { colorMode } = useColorMode();
  const store = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      store.updateTodoStatus(active.id as string, over.id as TodoStatus);
    }
  };

  const totalTasks = store.todos.length;
  const filteredTasks = useMemo(() => {
    if (!searchTerm.trim()) return totalTasks;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return store.todos.filter(todo => 
      todo.title.toLowerCase().includes(lowerSearchTerm) ||
      (todo.description && todo.description.toLowerCase().includes(lowerSearchTerm))
    ).length;
  }, [store.todos, searchTerm, totalTasks]);

  return (
    <>
      <TaskStats />
      <Box mb={4}>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        {searchTerm.trim() && (
          <Box mb={4}>
            <Badge colorScheme="blue" fontSize="sm">
              Found {filteredTasks} of {totalTasks} tasks
            </Badge>
          </Box>
        )}
      </Box>
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
              <TodoList status={status} searchTerm={searchTerm} />
            </GridItem>
          ))}
        </Grid>
      </DndContext>
    </>
  );
}); 