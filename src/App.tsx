import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  useColorMode,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { AddIcon, MoonIcon, SunIcon, RepeatIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { TodoBoard } from "./components/TodoBoard";
import { TodoForm } from "./components/TodoForm";
import { observer } from "mobx-react-lite";
import { useStore } from "./store";
import { loadSampleData } from "./utils/testData";

export const App = observer(() => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const store = useStore();

  const handleLoadSampleData = () => {
    loadSampleData(store);
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Box
        as="header"
        borderBottom="1px"
        borderColor={borderColor}
        bg={useColorModeValue("white", "gray.800")}
        position="sticky"
        top={0}
        zIndex={1}
      >
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <Heading size="lg">Task Tracker</Heading>
            <Flex gap={4}>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="blue"
                onClick={() => setIsAddFormOpen(true)}
              >
                Add Task
              </Button>
              <Tooltip label="Load sample data">
                <Button
                  leftIcon={<RepeatIcon />}
                  variant="outline"
                  colorScheme="green"
                  onClick={handleLoadSampleData}
                >
                  Load Sample
                </Button>
              </Tooltip>
              <Button
                onClick={toggleColorMode}
                variant="ghost"
                aria-label="Toggle color mode"
              >
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <TodoBoard />
      </Container>

      <TodoForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
      />
    </Box>
  );
});
