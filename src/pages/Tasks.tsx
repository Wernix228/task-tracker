import { useEffect, useState, RefObject } from "react";
import { Box, Flex, Input, InputGroup, InputLeftElement, useColorMode, SimpleGrid, Heading, Button } from "@chakra-ui/react";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { TaskColumnContainer } from "../components/TaskColumnContainer";
import { BoardHeader } from "../components";
import { useTasks } from "../data";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export function Tasks({
  isMobile,
  mainRef,
}: {
  isMobile: boolean;
  mainRef: RefObject<HTMLDivElement>;
}) {
  const { taskColumns: initialTaskColumns, updateTask } = useTasks();
  const [taskColumns, setTaskColumns] = useState<TaskColumn[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { colorMode } = useColorMode();

  useEffect(() => {
    setTaskColumns(initialTaskColumns);
  }, [setTaskColumns, initialTaskColumns]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = e.target.value;
    setSearchQuery(searchValue);
    
    if (searchValue !== "") {
      setTaskColumns(
        taskColumns.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) =>
            task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchValue.toLowerCase())
          ),
        }))
      );
    } else {
      setTaskColumns(initialTaskColumns);
    }
  }

  return (
    <MotionBox
      w="100%"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box p={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color={colorMode === "light" ? "purple.600" : "purple.300"}>
            My Tasks
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="purple"
            variant="solid"
            size="md"
          >
            New Task
          </Button>
        </Flex>

        <Flex mb={6} gap={4}>
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={handleSearch}
              variant="filled"
              bg={colorMode === "light" ? "gray.100" : "gray.700"}
              _hover={{
                bg: colorMode === "light" ? "gray.200" : "gray.600",
              }}
              _focus={{
                bg: colorMode === "light" ? "white" : "gray.600",
                borderColor: "purple.500",
              }}
            />
          </InputGroup>
        </Flex>

        <SimpleGrid
          columns={[1, null, 2, 3]}
          spacing={6}
          ref={mainRef}
        >
          <TaskColumnContainer
            isMobile={isMobile}
            taskColumns={taskColumns}
            setTaskColumns={setTaskColumns}
            updateTask={updateTask}
          />
        </SimpleGrid>
      </Box>
    </MotionBox>
  );
}
