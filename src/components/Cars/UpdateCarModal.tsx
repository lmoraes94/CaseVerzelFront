import React, { useRef } from "react";
import { Car } from "../../types/Car";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import api from "../../services/api";

type UpdateCarModalProps = {
  chosenCar: Car;
  isOpen: boolean;
  onClose: () => void;
};

type UpdateCarData = {
  name: string;
  model: string;
  brand: string;
  image: string | null;
  price: number;
};

export const UpdateCarModal = ({
  chosenCar,
  isOpen,
  onClose,
}: UpdateCarModalProps) => {
  const toast = useToast();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const queryClient = useQueryClient();

  const defaultValues: UpdateCarData = {
    name: chosenCar.name,
    model: chosenCar.model,
    image: chosenCar.image ?? null,
    brand: chosenCar.brand,
    price: chosenCar.price,
  };

  const { register, handleSubmit, watch } = useForm<UpdateCarData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    defaultValues,
  });

  const values = watch();

  const handleEditCar = async () => {
    const data = {
      name: values.name,
      model: values.model,
      brand: values.brand,
      price: +values.price,
    };

    const response = await api.put(`/cars/${chosenCar.id}`, data);

    return response;
  };

  const { status, mutate } = useMutation(handleEditCar, {
    onSuccess: ({ data }) => {
      toast({
        title: "Sucesso.",
        description: data?.message,
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "bottom-right",
      });
      queryClient.invalidateQueries("users");
      onClose();
    },
    onError: (e: any) => {
      toast({
        title: "Erro.",
        description: e.response.data.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom-right",
      });
    },
  });

  const handleChangeCarImage = async (image: any) => {
    const formData = new FormData();

    formData.append("image", image);

    const response = await api.patch(`/cars/${chosenCar?.id}/image`, formData);

    return response;
  };

  const { mutate: mutateImage } = useMutation(handleChangeCarImage, {
    onSuccess: ({ data }) => {
      toast({
        title: "Sucesso.",
        description: data?.message,
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "bottom-right",
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
        position: "bottom-right",
      });
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar veículo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack as="form" onSubmit={handleSubmit(() => mutate())}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                {...register("name")}
                focusBorderColor={"blue.500"}
                type="text"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Marca</FormLabel>
              <Input
                {...register("brand")}
                focusBorderColor={"blue.500"}
                type="text"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Modelo</FormLabel>
              <Input
                {...register("model")}
                focusBorderColor={"blue.500"}
                type="text"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Valor</FormLabel>
              <NumberInput defaultValue={15} precision={2} step={0.2}>
                <NumberInputField {...register("price")} />
                <NumberInputStepper>
                  <NumberIncrementStepper />

                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <Button>
              Alterar imagem
              <Input
                type="file"
                position="absolute"
                opacity="0"
                aria-hidden="true"
                accept="image/*"
                style={{ cursor: "pointer" }}
                onChange={(e) => {
                  if (e.target.files) mutateImage(e.target.files[0]);
                }}
              />
            </Button>
            <HStack style={{ marginTop: "32px" }} justifyContent={"flex-end"}>
              <Button mr={3} onClick={onClose}>
                Fechar
              </Button>
              <Button
                ref={initialRef}
                type="submit"
                isLoading={status === "loading"}
                colorScheme="blue"
              >
                Salvar
              </Button>
            </HStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
