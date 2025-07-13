import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Box,
  useColorMode,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const { colorMode } = useColorMode();

  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <Box mb={6}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search tasks by title or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          bg={colorMode === "light" ? "white" : "gray.700"}
          borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
          }}
          size="lg"
        />
        {searchTerm && (
          <InputRightElement>
            <Tooltip label="Clear search">
              <IconButton
                aria-label="Clear search"
                icon={<CloseIcon />}
                size="sm"
                variant="ghost"
                onClick={handleClear}
                colorScheme="gray"
              />
            </Tooltip>
          </InputRightElement>
        )}
      </InputGroup>
    </Box>
  );
} 