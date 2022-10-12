import React, { useState } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { SidebarWithHeader } from "../components/SidebarWithHeader";
import { Stack, Text, useDisclosure } from "@chakra-ui/react";
import { UserRows } from "../types/UserRows";
import api from "../services/api";
import { AddUserModal } from "../components/Users/AddUserModal";
import { useQuery } from "react-query";
import { UserTable } from "../components/Users/UserTable";
import { UsersMain } from "../components/Users/UsersMain";

type IHandleGetAllUsersProps = {
  queryKey: Array<any>;
};

const Users: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [q, setQ] = useState<string>("");

  const handleGetAllUsers = async ({
    queryKey,
  }: IHandleGetAllUsersProps): Promise<UserRows> => {
    const response = await api.get<UserRows>(
      `/${queryKey[0]}?page=${queryKey[1]}&pageSize=${queryKey[2]}&q=${queryKey[3]}`
    );

    return response.data;
  };

  const { data, status } = useQuery(
    ["users", page, pageSize, q],
    handleGetAllUsers,
    {
      keepPreviousData: true,
    }
  );

  return (
    <>
      <UsersMain status={status}>
        {isOpen ? <AddUserModal isOpen={isOpen} onClose={onClose} /> : false}
        <Head>
          <title>Usuários</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SidebarWithHeader>
          <Stack
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDirection={"row"}
            role="users/stack"
          >
            <Text fontSize={"3xl"} mt={2} mb={6}>
              Usuários
            </Text>
          </Stack>
          <UserTable
            data={data?.rows ?? []}
            count={data?.count ?? 0}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            q={q}
            setQ={setQ}
            onOpen={onOpen}
          />
        </SidebarWithHeader>
      </UsersMain>
    </>
  );
};

export default Users;
