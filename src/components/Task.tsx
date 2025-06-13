import { Box, Flex, Spacer, Text, useDisclosure, useColorMode, Badge, IconButton, Avatar, Tooltip } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import dayjs from "dayjs";
import { TaskForm } from "./TaskForm";
import { EditIcon, TimeIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export function Task({ task, boardId }: { task: Task; boardId?: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });
  const { colorMode } = useColorMode();

  const isOverdue = dayjs().isAfter(dayjs(task.dueDate).add(1, "day"));
  const displayDate = dayjs(
    task.createdDate && !task.editedDate ? task.createdDate : task.editedDate
  ).format("MM/DD/YYYY h:mm A");

  return (
    <Box position="relative">
      <MotionBox
        bg={colorMode === "light" ? "white" : "gray.700"}
        borderRadius="xl"
        p={4}
        my={3}
        boxShadow="md"
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        transform={transform ? `translate3d(${transform.x}px, ${transform.y}px, 10)` : undefined}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        borderWidth="1px"
        borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
        _hover={{
          boxShadow: "lg",
          borderColor: colorMode === "light" ? "purple.200" : "purple.500",
        }}
      >
        <Flex width="100%" alignItems="center" mb={3}>
          <PriorityBadge priority={task.priority} />
          <Text
            fontSize="md"
            fontWeight="semibold"
            mx={3}
            noOfLines={1}
            maxW="150px"
            color={colorMode === "light" ? "gray.700" : "white"}
          >
            {task.title}
          </Text>
          <Spacer />
          <Tooltip label="Edit task">
            <IconButton
              aria-label="Edit task"
              icon={<EditIcon />}
              size="sm"
              variant="ghost"
              colorScheme="purple"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
            />
          </Tooltip>
        </Flex>

        <Box mt={2}>
          {task.dueDate && (
            <Flex align="center" mb={2}>
              <TimeIcon mr={2} color={isOverdue ? "red.500" : "gray.500"} />
              <Badge
                colorScheme={isOverdue ? "red" : "purple"}
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                {isOverdue ? "Overdue!" : `Due: ${task.dueDate}`}
              </Badge>
            </Flex>
          )}
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.500" : "gray.400"}
            mb={2}
          >
            {task.createdDate && !task.editedDate
              ? `Created at: ${displayDate}`
              : `Edited at ${displayDate}`}
          </Text>
          {task.description && (
            <Text
              fontSize="sm"
              color={colorMode === "light" ? "gray.600" : "gray.300"}
              noOfLines={2}
              bg={colorMode === "light" ? "gray.50" : "gray.600"}
              p={2}
              borderRadius="md"
            >
              {task.description}
            </Text>
          )}
        </Box>
      </MotionBox>
      <TaskForm
        isOpen={isOpen}
        onClose={onClose}
        task={task}
        boardId={boardId}
      />
    </Box>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const priorityMap = {
    "0": { color: "green", label: "Low" },
    "1": { color: "yellow", label: "Medium" },
    "2": { color: "red", label: "High" },
  };

  const { color, label } = priorityMap[priority] || { color: "gray", label: "None" };

  return (
    <Badge
      colorScheme={color}
      variant="solid"
      px={2}
      py={1}
      borderRadius="md"
    >
      {label}
    </Badge>
  );
}
