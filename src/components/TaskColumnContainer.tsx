import { useState } from "react";
import { Box, Flex, useColorMode } from "@chakra-ui/react";
import {
  rectIntersection,
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";
import { TaskColumn } from "../components/TaskColumn";
import { useTasks } from "../data";
import { Task } from "../components/Task";
import { TaskFooter } from "../components/TaskFooter";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

export function TaskColumnContainer({
  isMobile,
  taskColumns,
  setTaskColumns,
  title,
  updateTask,
  boardId,
}: {
  isMobile: boolean;
  taskColumns: TaskColumn[];
  setTaskColumns: (args: TaskColumn[]) => void;
  updateTask: (args) => void;
  title?: string;
  boardId?: string;
}) {
  const [prevStatus, setPrevStatus] = useState("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { getTaskById } = useTasks();
  const { colorMode } = useColorMode();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(mouseSensor);

  return (
    <Box width="100%" p={4}>
      <DndContext
        collisionDetection={rectIntersection}
        onDragStart={async (event) => {
          const taskId = event.active.id.toString();
          const currentTask = await getTaskById(taskId);

          setPrevStatus(currentTask.status ?? "0");
          setActiveTask(currentTask);

          const updatedTask = {
            ...currentTask,
            status: "",
          } as Task;
          if (!boardId) {
            updateTask(updatedTask);
            return;
          }
        }}
        onDragEnd={async ({ over }) => {
          if (activeTask && !over) {
            updateTask({ ...activeTask, status: prevStatus } as Task);
          }

          if (activeTask && over) {
            updateTask({ ...activeTask, status: over?.id } as Task);
          }
          setPrevStatus("");
          setActiveTask(null);
        }}
        onDragCancel={() => {
          if (activeTask) {
            updateTask({ ...activeTask, status: prevStatus });
          }
          setPrevStatus("");
          setActiveTask(null);
        }}
        sensors={sensors}
      >
        <Flex
          overflowX="auto"
          direction={isMobile ? "column" : "row"}
          mt={isMobile ? 6 : undefined}
          pb={isMobile ? "150px" : undefined}
          justifyItems={isMobile ? "center" : "inherit"}
          gap={4}
          css={{
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: colorMode === "light" ? "gray.100" : "gray.700",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: colorMode === "light" ? "gray.300" : "gray.600",
              borderRadius: "4px",
              "&:hover": {
                background: colorMode === "light" ? "gray.400" : "gray.500",
              },
            },
          }}
        >
          <AnimatePresence>
            {taskColumns
              ?.sort((a, b) => (a.status > b.status ? 1 : -1))
              .map((task, index) => (
                <MotionBox
                  key={task.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  flex="0 0 auto"
                  minW="300px"
                  maxW="400px"
                >
                  <TaskColumn
                    isMobile={isMobile}
                    taskColumn={task}
                    boardId={boardId}
                  />
                </MotionBox>
              ))}
          </AnimatePresence>
        </Flex>
        <DragOverlay>
          {activeTask && (
            <MotionBox
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Task task={activeTask} />
            </MotionBox>
          )}
        </DragOverlay>
      </DndContext>
      {isMobile && <TaskFooter />}
    </Box>
  );
}
