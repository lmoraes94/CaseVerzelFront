import { useState, Dispatch, SetStateAction } from "react";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineSearch,
} from "react-icons/ai";
import { MdClear } from "react-icons/md";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";
import { User } from "../../types/User";
import { UpdateUserModal } from "./UpdateUserModal";
import { DeleteUserModal } from "./DeleteUserModal";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Input,
  Avatar,
  IconButton,
  Text,
  Tooltip,
  Select,
  Box,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";

type UserTableProps = {
  data: User[];
  count: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  q: string;
  setQ: Dispatch<SetStateAction<string>>;
  onOpen: () => void;
};

export const UserTable = ({
  data,
  count,
  page,
  setPage,
  pageSize,
  setPageSize,
  q,
  setQ,
  onOpen,
}: UserTableProps) => {
  const { user } = useAuth();

  const {
    isOpen: isOpenEditModal,
    onOpen: OnOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();

  const {
    isOpen: isOpenDeleteModal,
    onOpen: OnOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const [chosenUser, setChosenUser] = useState<User | null>(null);

  return (
    <>
      {isOpenEditModal && chosenUser ? (
        <UpdateUserModal
          chosenUser={chosenUser}
          isOpen={isOpenEditModal}
          onClose={onCloseEditModal}
        />
      ) : (
        false
      )}
      {isOpenDeleteModal && chosenUser ? (
        <DeleteUserModal
          chosenUser={chosenUser}
          isOpen={isOpenDeleteModal}
          onClose={onCloseDeleteModal}
        />
      ) : (
        false
      )}
      <Box border="1px solid #2d3748" borderRadius={8}>
        <Box
          mb={6}
          p={4}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <InputGroup w={{ base: "60%", md: "35%" }}>
            <InputLeftElement
              pointerEvents="none"
              // eslint-disable-next-line react/no-children-prop
              children={<AiOutlineSearch />}
            />
            <Input
              placeholder="Pesquisar"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
            />
            {q?.length > 0 ? (
              <InputRightElement
                onClick={() => {
                  setQ("");
                  setPage(0);
                }}
                // eslint-disable-next-line react/no-children-prop
                children={<MdClear />}
                style={{ cursor: "pointer" }}
              />
            ) : (
              false
            )}
          </InputGroup>
          {user?.role === "User" ? (
            false
          ) : (
            <Button variant={"outline"} onClick={onOpen}>
              Adicionar
            </Button>
          )}
        </Box>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Avatar</Th>
                <Th>Nome</Th>
                <Th>E-mail</Th>
                {user?.role === "User" ? false : <Th>Ações</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((item, index) => {
                return (
                  <Tr key={index}>
                    <Td>{item?.id}</Td>
                    <Td>
                      <Avatar name={item?.name} src={item?.avatar} />
                    </Td>
                    <Td>{item?.name}</Td>
                    <Td>{item?.email}</Td>
                    {user?.role === "User" ? (
                      false
                    ) : (
                      <Td>
                        <Tooltip label="Editar usuário">
                          <IconButton
                            onClick={() => {
                              setChosenUser(item);
                              OnOpenEditModal();
                            }}
                            icon={<AiOutlineEdit />}
                            colorScheme="yellow"
                            aria-label="Edit"
                            mr={2}
                          />
                        </Tooltip>
                        <Tooltip label="Remover usuário">
                          <IconButton
                            onClick={() => {
                              setChosenUser(item);
                              OnOpenDeleteModal();
                            }}
                            icon={<AiOutlineDelete />}
                            colorScheme="red"
                            aria-label="Delete"
                          />
                        </Tooltip>
                      </Td>
                    )}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        {data?.length === 0 ? (
          false
        ) : (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={4}
            gap={2}
            p={4}
            flexWrap={"wrap"}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box>
              <Tooltip label="Primeira página">
                <IconButton
                  icon={<HiOutlineChevronDoubleLeft />}
                  aria-label="Previous"
                  mr={2}
                  disabled={page === 0}
                  onClick={() => setPage(0)}
                />
              </Tooltip>
              <Tooltip label="Página anterior">
                <IconButton
                  icon={<HiOutlineChevronLeft />}
                  aria-label="Next"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                />
              </Tooltip>
            </Box>
            <Box gap={1} style={{ display: "flex", alignItems: "center" }}>
              <Text>Página</Text>
              <Text style={{ fontWeight: "bold" }}>
                {page + 1} de {Math.ceil(count / pageSize)}
              </Text>
            </Box>
            <Box gap={2} style={{ display: "flex", alignItems: "center" }}>
              <Text>Linhas por página:</Text>
              <Select
                width={"80px"}
                style={{ cursor: "pointer" }}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(+e.target.value);
                  setPage(0);
                }}
              >
                {[5, 10, 25, 50].map((pSize) => {
                  return (
                    <option key={pSize} value={pSize}>
                      {pSize}
                    </option>
                  );
                })}
              </Select>
            </Box>
            <Box>
              <Tooltip label="Próxima página">
                <IconButton
                  disabled={page + 1 === Math.ceil(count / pageSize)}
                  icon={<HiOutlineChevronRight />}
                  aria-label="Previous"
                  mr={2}
                  onClick={() => setPage(page + 1)}
                />
              </Tooltip>
              <Tooltip label="Última página">
                <IconButton
                  disabled={page + 1 === Math.ceil(count / pageSize)}
                  icon={<HiOutlineChevronDoubleRight />}
                  aria-label="Next"
                  onClick={() => setPage(Math.ceil(count / pageSize) - 1)}
                />
              </Tooltip>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
