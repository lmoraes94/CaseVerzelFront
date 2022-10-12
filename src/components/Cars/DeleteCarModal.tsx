import React, { useRef } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import api from "../../services/api";
import { Car } from "../../types/Car";
import { useMutation, useQueryClient } from "react-query";

type DeleteCarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  chosenCar: Car;
};

export const DeleteCarModal = ({
  isOpen,
  onClose,
  chosenCar,
}: DeleteCarModalProps) => {
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const toast = useToast();

  const queryClient = useQueryClient();

  const handleDeleteUser = async () => {
    const response = await api.delete(`/cars/${chosenCar?.id}`);

    return response;
  };

  const { status, mutate } = useMutation(handleDeleteUser, {
    onSuccess: ({ data }) => {
      toast({
        title: "Sucesso.",
        description: data?.message,
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
      queryClient.invalidateQueries("cars");
      onClose();
    },

    onError: (e: any) => {
      toast({
        title: "Erro.",
        description: e.response.data.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Remover veículo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Tem certeza que deseja remover o veículo {chosenCar?.brand} -{" "}
            {chosenCar?.model} / {chosenCar?.name}?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Fechar
          </Button>
          <Button
            ref={initialRef}
            isLoading={status === "loading"}
            colorScheme="blue"
            onClick={() => mutate()}
          >
            Excluir
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
