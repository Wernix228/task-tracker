import { Box, Flex, Text, Badge, IconButton, Tooltip, useColorMode, Tag, TagLabel } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const MotionBox = motion(Box);

interface WorkItemCardProps {
  item: WorkItem;
  onEdit: (item: WorkItem) => void;
  onDelete: (itemId: string) => void;
}

export function WorkItemCard({ item, onEdit, onDelete }: WorkItemCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });
  const { colorMode } = useColorMode();

  const isOverdue = item.dueDate && dayjs().isAfter(dayjs(item.dueDate));

  return (
    <MotionBox
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      transform={transform ? `translate3d(${transform.x}px, ${transform.y}px, 10)` : undefined}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        bg={colorMode === "light" ? "white" : "gray.700"}
        borderRadius="xl"
        p={4}
        my={3}
        boxShadow="md"
        borderWidth="1px"
        borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
        _hover={{
          boxShadow: "lg",
          borderColor: colorMode === "light" ? "purple.200" : "purple.500",
        }}
      >
        <Flex justify="space-between" align="center" mb={3}>
          <Badge
            colorScheme={getPriorityColor(item.priority)}
            variant="solid"
            px={2}
            py={1}
            borderRadius="md"
          >
            {item.priority}
          </Badge>
          <Flex gap={2}>
            <Tooltip label="Edit">
              <IconButton
                aria-label="Edit work item"
                icon={<EditIcon />}
                size="sm"
                variant="ghost"
                colorScheme="purple"
                onClick={() => onEdit(item)}
              />
            </Tooltip>
            <Tooltip label="Delete">
              <IconButton
                aria-label="Delete work item"
                icon={<DeleteIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => onDelete(item.id)}
              />
            </Tooltip>
          </Flex>
        </Flex>

        <Text
          fontSize="md"
          fontWeight="semibold"
          mb={2}
          color={colorMode === "light" ? "gray.700" : "white"}
        >
          {item.name}
        </Text>

        <Text
          fontSize="sm"
          color={colorMode === "light" ? "gray.600" : "gray.300"}
          noOfLines={2}
          mb={3}
        >
          {item.content}
        </Text>

        {item.tags.length > 0 && (
          <Flex wrap="wrap" gap={2} mb={3}>
            {item.tags.map(tag => (
              <Tag
                key={tag}
                size="sm"
                borderRadius="full"
                variant="subtle"
                colorScheme="purple"
              >
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))}
          </Flex>
        )}

        <Flex justify="space-between" align="center" fontSize="xs" color="gray.500">
          <Text>
            {dayjs(item.updatedAt).format("MMM D, YYYY")}
          </Text>
          {item.dueDate && (
            <Badge
              colorScheme={isOverdue ? "red" : "green"}
              variant="subtle"
            >
              {isOverdue ? "Overdue" : `Due: ${dayjs(item.dueDate).format("MMM D")}`}
            </Badge>
          )}
        </Flex>
      </Box>
    </MotionBox>
  );
}

function getPriorityColor(priority: PriorityLevel): string {
  switch (priority) {
    case 'high':
      return 'red';
    case 'medium':
      return 'yellow';
    case 'low':
      return 'green';
    default:
      return 'gray';
  }
} 