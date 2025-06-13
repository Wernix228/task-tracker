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

  useEffect(() => {
    if (todo) {
      setTitle(todo.title ?? "");
      setDescription(todo.description ?? "");
      setDueDate(todo.dueDate ?? "");
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todo?.id, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (todo) {
      store.editTodo({
        ...todo,
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
      });
    } else {
      store.addTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={colorMode === "light" ? "white" : "gray.800"}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {todo ? "Edit Todo" : "Add New Todo"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter todo title"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter todo description"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue">
              {todo ? "Save Changes" : "Add Todo"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}); 