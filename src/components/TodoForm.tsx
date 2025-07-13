import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useColorMode,
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store";
import { useState, useEffect } from "react";

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  todo?: TodoItem;
}

export const TodoForm = observer(({ isOpen, onClose, todo }: TodoFormProps) => {
  const { colorMode } = useColorMode();
  const store = useStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (todo) {
        setTitle(todo.title || "");
        setDescription(todo.description || "");
        setDueDate(todo.dueDate || "");
      } else {
        setTitle("");
        setDescription("");
        setDueDate("");
      }
      setTitleError("");
    }
  }, [todo, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }
    
    setTitleError("");

    if (todo) {
      // Редактирование существующей задачи
      store.editTodo({
        ...todo,
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
      });
    } else {
      // Создание новой задачи
      store.addTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        order: store.todos.length,
      });
    }
    
    onClose();
  };

  const handleClose = () => {
    setTitleError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent bg={colorMode === "light" ? "white" : "gray.800"}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {todo ? "Edit Task" : "Add New Task"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={!!titleError}>
                <FormLabel>Title</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (titleError) setTitleError("");
                  }}
                  placeholder="Enter task title"
                  autoFocus
                />
                {titleError && <FormErrorMessage>{titleError}</FormErrorMessage>}
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description (optional)"
                  rows={3}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue">
              {todo ? "Save Changes" : "Add Task"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}); 