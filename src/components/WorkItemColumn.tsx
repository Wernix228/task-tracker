import { Box, Flex, Text, useColorMode, Badge } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { WorkItemCard } from "./WorkItemCard";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface WorkItemColumnProps {
  column: WorkItemColumn;
  onEditItem: (item: WorkItem) => void;
  onDeleteItem: (itemId: string) => void;
}

export function WorkItemColumn({ column, onEditItem, onDeleteItem }: WorkItemColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });
  const { colorMode } = useColorMode();

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        bg={colorMode === "light" ? "gray.50" : "gray.800"}
        borderRadius="lg"
        p={4}
        minH="500px"
        ref={setNodeRef}
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color={colorMode === "light" ? "gray.700" : "white"}
          >
            {column.title}
          </Text>
          <Badge
            colorScheme="purple"
            variant="subtle"
            px={2}
            py={1}
            borderRadius="md"
          >
            {column.items.length}
          </Badge>
        </Flex>

        <Box>
          {column.items.map(item => (
            <WorkItemCard
              key={item.id}
              item={item}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
            />
          ))}
        </Box>
      </Box>
    </MotionBox>
  );
} 