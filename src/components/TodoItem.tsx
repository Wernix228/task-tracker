import { Box, Flex, Text, IconButton, useColorMode, Switch, Tooltip } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Temporal } from '@js-temporal/polyfill';
import { useState } from "react";
import { TodoForm } from "./TodoForm";

interface TodoItemProps {
  todo: TodoItem;
  onEdit: (todo: TodoItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
}

export function TodoItem({ todo, onEdit, onDelete, onStatusChange }: TodoItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: todo.id,
  });
  const { colorMode } = useColorMode();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOverdue = todo.dueDate && 
    Temporal.PlainDate.compare(
      Temporal.PlainDate.from(todo.dueDate),
      Temporal.Now.plainDateISO()
    ) < 0;

  return (
    <>
      <Box
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{
          transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 10)` : undefined,
        }}
      >
        <Box
          bg={colorMode === "light" ? "white" : "gray.700"}
          borderRadius="lg"
          p={4}
          my={2}
          boxShadow="md"
          borderWidth="1px"
          borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
          _hover={{
            boxShadow: "lg",
            borderColor: colorMode === "light" ? "blue.200" : "blue.500",
          }}
          transition="all 0.2s"
        >
          <Flex justify="space-between" align="center" mb={3}>
            <Switch
              isChecked={todo.status === 'completed'}
              onChange={() => onStatusChange(
                todo.id,
                todo.status === 'completed' ? 'active' : 'completed'
              )}
              colorScheme="green"
            />
            <Flex gap={2}>
              <Tooltip label="Edit">
                <IconButton
                  aria-label="Edit todo"
                  icon={<EditIcon />}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => setIsEditModalOpen(true)}
                />
              </Tooltip>
              <Tooltip label="Delete">
                <IconButton
                  aria-label="Delete todo"
                  icon={<DeleteIcon />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onDelete(todo.id)}
                />
              </Tooltip>
            </Flex>
          </Flex>

          <Text
            fontSize="md"
            fontWeight="semibold"
            mb={2}
            color={colorMode === "light" ? "gray.700" : "white"}
            textDecoration={todo.status === 'completed' ? 'line-through' : 'none'}
          >
            {todo.title}
          </Text>

          {todo.description && (
            <Text
              fontSize="sm"
              color={colorMode === "light" ? "gray.600" : "gray.300"}
              mb={3}
            >
              {todo.description}
            </Text>
          )}

          <Flex justify="space-between" align="center" fontSize="xs" color="gray.500">
            <Text>
              {Temporal.PlainDateTime.from(todo.updatedAt).toLocaleString()}
            </Text>
            {todo.dueDate && (
              <Text
                color={isOverdue ? "red.500" : "green.500"}
                fontWeight="medium"
              >
                {isOverdue ? "Overdue" : `Due: ${Temporal.PlainDate.from(todo.dueDate).toLocaleString()}`}
              </Text>
            )}
          </Flex>
        </Box>
      </Box>

      <TodoForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        todo={todo}
      />
    </>
  );
} 