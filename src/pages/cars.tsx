import React, { useState } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { SidebarWithHeader } from "../components/SidebarWithHeader";
import { Stack, Text, useDisclosure } from "@chakra-ui/react";
import { CarRows } from "../types/CarRows";
import api from "../services/api";
import { AddCarModal } from "../components/Cars/AddCarModal";
import { useQuery } from "react-query";
import { CarTable } from "../components/Cars/CarTable";
import { CarsMain } from "../components/Cars/CarsMain";

type IHandleGetAllCarsProps = {
  queryKey: Array<any>;
};

const Cars: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [q, setQ] = useState<string>("");

  const handleGetAllCars = async ({
    queryKey,
  }: IHandleGetAllCarsProps): Promise<CarRows> => {
    const response = await api.get<CarRows>(
      `/${queryKey[0]}?page=${queryKey[1]}&pageSize=${queryKey[2]}&q=${queryKey[3]}`
    );

    return response.data;
  };

  const { data, status } = useQuery(
    ["cars", page, pageSize, q],
    handleGetAllCars,
    {
      keepPreviousData: true,
    }
  );

  return (
    <>
      <CarsMain status={status}>
        {isOpen ? <AddCarModal isOpen={isOpen} onClose={onClose} /> : false}
        <Head>
          <title>Veículos</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SidebarWithHeader>
          <Stack
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDirection={"row"}
          >
            <Text fontSize={"3xl"} mt={2} mb={6}>
              Veículos
            </Text>
          </Stack>
          <CarTable
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
      </CarsMain>
    </>
  );
};

export default Cars;
