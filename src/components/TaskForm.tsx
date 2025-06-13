import { forwardRef, useState, useEffect } from "react";
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  Select,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";
import { FaPlus, FaRegTrashCan } from "react-icons/fa6";
import { v4 as uuidV4 } from "uuid";
import dayjs from "dayjs";
import { useTasks} from "../data";
import { DeleteConfirmation } from "./TaskOptions";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const TaskFormSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
});

interface TaskValues {
  title: string;
  priority: string;
  status: string;
  details: string;
}

function TitleInput(props) {
  return (
    <Input
      placeholder="Enter a Description..."
      backgroundColor="white"
      {...props}
    />
  );
}

function PrioritySelect(props) {
  return (
    <Select placeholder="Select" backgroundColor="white" {...props}>
      <option value={0}>Low</option>
      <option value={1}>Medium</option>
      <option value={2}>High</option>
    </Select>
  );
}

function StatusSelect(props) {
  return (
    <Select placeholder="Select" backgroundColor="white" {...props}>
      <option value={0}>Backlog</option>
      <option value={1}>In Progress</option>
      <option value={2}>Review</option>
      <option value={3}>Done</option>
    </Select>
  );
}

function ColumnSelect({ boardId, ...props }) {
  const [columns, setColumns] = useState<TaskColumn[]>([]);
  const propsCopy = { ...props, boardId: undefined };

  return (
    <Select placeholder="Select" backgroundColor="white" {...propsCopy}>
      {columns
        .sort((a, b) => (a.status > b.status ? 1 : -1))
        .map(({ status, title }) => (
          <option value={status} key={status}>
            {title}
          </option>
        ))}
    </Select>
  );
}

export function TaskForm({
  isOpen,
  onClose,
  task,
  boardId,
}: {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  boardId?: string;
}) {
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task?.dueDate) : undefined
  );
  const hasTask = !!task;
  const { createTask, updateTask } = useTasks(onClose);
  const isOverdue = !!dayjs().isAfter(dayjs(task?.dueDate).add(1, "day"));
  const daysLeft = task?.dueDate ? dayjs(dueDate).diff(new Date(), "d") : null;

  // @ts-expect-error - undefined values
  const DueDate = forwardRef(({ onClick, value, placeholder }, ref) => (
    // @ts-expect-error - ref
    <Button width="100%" onClick={onClick} ref={ref}>
      {value.length > 0 ? value : placeholder}
    </Button>
  ));

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="gray.600">
        <ModalHeader color="white" textTransform="uppercase">
          Create Task
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <Box>
            <Formik
              initialValues={{
                title: task?.title ?? "",
                priority: task?.priority ?? "",
                status: task?.status ?? "",
                details: task?.details ?? "",
              }}
              validationSchema={TaskFormSchema}
              onSubmit={(values: TaskValues) => {
                if (values.status === "") {
                  values.status = "0";
                }
                if (values.priority === "") {
                  values.priority = "0";
                }
                if (task) {
                  updateTask({
                    id: task.id,
                    createdDate: task.createdDate,
                    editedDate: dayjs().format(),
                    ...values,
                    description: values.details,
                  });
                  return;
                }
                createTask({
                  id: uuidV4(),
                  createdDate: new Date().toLocaleString(),
                  dueDate: dueDate ? dueDate.toLocaleDateString() : undefined,
                  ...values,
                } as Task);
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <ModalBody>
                    <FormControl my={6}>
                      <FormLabel color="white">Title*</FormLabel>
                      <Field id="title" name="title" as={TitleInput} />
                      {errors.title && touched.title ? (
                        <Text color="red.400" fontWeight="bold">
                          {errors.title}
                        </Text>
                      ) : null}
                    </FormControl>
                    <FormControl my={6}>
                      <FormLabel color="white">
                        <Flex>
                          Due Date
                          {isOverdue ? (
                            <Text color="red.400" fontWeight="bold">
                              &nbsp;-&nbsp;Overdue!
                            </Text>
                          ) : daysLeft ? (
                            <>:&nbsp;{daysLeft}&nbsp;Days Left</>
                          ) : null}
                        </Flex>
                      </FormLabel>
                      <Flex>
                        <DatePicker
                          selected={dueDate}
                          onChange={(date) => (date ? setDueDate(date) : null)}
                          placeholderText="No Due Date"
                          customInput={<DueDate />}
                        />
                        {dueDate && (
                          <Button
                            ml={8}
                            bgColor="orange.200"
                            onClick={() => setDueDate(undefined)}
                          >
                            Clear Due Date
                          </Button>
                        )}
                      </Flex>
                    </FormControl>
                    <FormControl my={6}>
                      <FormLabel color="white">Priority</FormLabel>
                      <Field
                        id="priority"
                        name="priority"
                        as={PrioritySelect}
                      />
                    </FormControl>
                    <FormControl my={6}>
                      <FormLabel color="white">
                        {boardId ? "Column" : "Status"}
                      </FormLabel>
                      {boardId ? (
                        <Field
                          id="status"
                          name="status"
                          boardId={boardId}
                          as={ColumnSelect}
                        />
                      ) : (
                        <Field id="status" name="status" as={StatusSelect} />
                      )}
                    </FormControl>
                    <FormControl my={6}>
                      <FormLabel color="white">Details</FormLabel>
                      <Field
                        id="details"
                        name="details"
                        bgColor="white"
                        as={Textarea}
                      />
                    </FormControl>
                  </ModalBody>
                  <ModalFooter>
                    <Flex>
                      {task && (
                        <Button
                          mr={4}
                          rightIcon={<FaRegTrashCan />}
                          onClick={onDeleteOpen}
                        >
                          Delete Task
                        </Button>
                      )}
                      <Button
                        colorScheme="orange"
                        type="submit"
                        rightIcon={isSubmitting ? undefined : <FaPlus />}
                        w="130px"
                      >
                        {isSubmitting ? (
                          <Spinner />
                        ) : (
                          <Text>{hasTask ? "Save" : "Create"} Task</Text>
                        )}
                      </Button>
                    </Flex>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </Box>
        </ModalBody>
      </ModalContent>
      {task && (
        <DeleteConfirmation
          onClose={onDeleteClose}
          isOpen={isDeleteOpen}
          taskId={task.id}
        />
      )}
    </Modal>
  );
}
