import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Spacer,
  Text,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { FaPlus, FaPlusMinus, FaMagnifyingGlass } from "react-icons/fa6";
import { TaskForm } from "../components/TaskForm";

export function BoardHeader({
  id,
  title,
  setActiveBoard,
  handleSearch,
  button,
}: {
  id?: string;
  title: string;
  setActiveBoard: (args: string) => void;
  handleSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  button?: React.ReactNode;
}) {
  const {
    isOpen: isTaskFormOpen,
    onOpen: onTaskFormOpen,
    onClose: onTaskFormClose,
  } = useDisclosure();

  return (
    <>
      <Box px={8} py={4} width="100%">
        <Flex>
          <Text color="white" fontSize="2xl" fontWeight="bold">
            {title}
          </Text>
          <Spacer />
          {button}
        </Flex>
        <Divider my={4} />
        <Flex>
          <Button
            bgColor="orange.400"
            color="white"
            fontWeight="bold"
            textTransform="uppercase"
            onClick={onTaskFormOpen}
            rightIcon={<FaPlus />}
            _hover={{
              backgroundColor: "orange.500",
            }}
            transition="background-color 0.5s"
          >
            <Text mr={3}>Create Task</Text>
          </Button>
          <Spacer />
          <InputGroup maxW="320px">
            <InputLeftElement pointerEvents="none">
              <FaMagnifyingGlass />
            </InputLeftElement>
            <Input
              placeholder="Search for a Task"
              bgColor="white"
              onChange={handleSearch}
            />
          </InputGroup>
        </Flex>
      </Box>
      <TaskForm
        boardId={id}
        isOpen={isTaskFormOpen}
        onClose={onTaskFormClose}
      />
    </>
  );
}
