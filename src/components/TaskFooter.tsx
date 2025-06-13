import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import { TaskForm } from "./TaskForm";

export function TaskFooter() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Flex
			position="fixed"
			justifyContent="center"
			width="100%"
			bottom={4}
			bg="gray.700"
		>
			<Button
				bgColor="orange.400"
				color="white"
				fontWeight="bold"
				textTransform="uppercase"
				onClick={onOpen}
				rightIcon={<FaPlus />}
				_hover={{
					backgroundColor: "orange.500",
				}}
				transition="background-color 0.5s"
			>
				<Text mr={3}>Create Task</Text>
			</Button>
			<TaskForm isOpen={isOpen} onClose={onClose} />
		</Flex>
	);
}
