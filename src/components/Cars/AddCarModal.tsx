import React, { useRef } from "react";
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

type AddCarModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AddCarData = {
  name: string;
  model: string;
  brand: string;
  image: string | "";
  price: number;
};

export const AddCarModal = ({ isOpen, onClose }: AddCarModalProps) => {
  const toast = useToast();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const queryClient = useQueryClient();

  const defaultValues: AddCarData = {
    name: "",
    brand: "",
    model: "",
    image: "",
    price: 0,
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddCarData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    defaultValues,
  });

  const values = watch();

  const handleCreateCar = async () => {
    const data = {
      name: values.name,
      model: values.model,
      brand: values.brand,
      price: +values.price,
    };

    const response = await api.post("/cars", data);

    return response;
  };

  const { status, mutate } = useMutation(handleCreateCar, {
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
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar novo veículo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack as="form" onSubmit={handleSubmit(() => mutate())}>
            <FormControl isRequired>
              <FormLabel>Ano</FormLabel>
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
