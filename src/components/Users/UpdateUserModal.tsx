import React, { useRef, useState } from "react";
import { User } from "../../types/User";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import updateUserSchema from "../../validations/updateUserSchema";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../../services/api";
import { formatCellphone } from "../../utils/formatter";

type UpdateUserModalProps = {
  chosenUser: User;
  isOpen: boolean;
  onClose: () => void;
};

type UpdateUserData = {
  name: string;
  username: string;
  email: string;
  phone: string | null;
  role: "Admin" | "User";
  password: null;
};

export const UpdateUserModal = ({
  chosenUser,
  isOpen,
  onClose,
}: UpdateUserModalProps) => {
  const toast = useToast();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const queryClient = useQueryClient();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const defaultValues: UpdateUserData = {
    name: chosenUser.name,
    username: chosenUser.username,
    email: chosenUser.email,
    phone: chosenUser.phone ?? null,
    role: chosenUser.role,
    password: null,
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    resolver: yupResolver(updateUserSchema),
    defaultValues,
  });

  const values = watch();

  if (values.phone === "") setValue("phone", null);
  if (values.password === "") setValue("password", null);

  const handleEditUser = async () => {
    let data;

    if (values.password === null)
      data = {
        name: values.name,
        username: values.username,
        email: values.email,
        phone: values.phone,
        role: values.role,
      };
    else
      data = {
        name: values.name,
        username: values.username,
        email: values.email,
        phone: values.phone,
        role: values.role,
        password: values.password,
      };

    const response = await api.put(`/users/${chosenUser.id}`, data);

    return response;
  };

  const { status, mutate } = useMutation(handleEditUser, {
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

  return (
    <Modal
      isOpen={isOpen}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar usuário</ModalHeader>
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
              {errors && errors.name && (
                <FormHelperText>{errors.name.message}</FormHelperText>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Nome de usuário</FormLabel>
              <Input
                {...register("username")}
                focusBorderColor={"blue.500"}
                type="text"
              />
              {errors && errors.username && (
                <FormHelperText>{errors.username.message}</FormHelperText>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>E-mail</FormLabel>
              <Input
                {...register("email")}
                focusBorderColor={"blue.500"}
                type="email"
              />
              {errors && errors.email && (
                <FormHelperText>{errors.email.message}</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Telefone</FormLabel>
              <Input
                {...register("phone")}
                focusBorderColor={"blue.500"}
                type="text"
                value={formatCellphone(values.phone ? values.phone : "")}
                maxLength={15}
              />
              {errors && errors.phone && (
                <FormHelperText>{errors.phone.message}</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Função</FormLabel>
              <Select {...register("role")} placeholder="Selecione">
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </Select>
              {errors && errors.role && (
                <FormHelperText>{errors.role.message}</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Senha</FormLabel>
              <InputGroup>
                <Input
                  {...register("password")}
                  focusBorderColor={"blue.500"}
                  type={isPasswordVisible ? "text" : "password"}
                />
                <InputRightElement width={"3.5rem"}>
                  {isPasswordVisible ? (
                    <AiOutlineEye
                      size={24}
                      cursor="pointer"
                      onClick={() => setIsPasswordVisible(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      size={24}
                      cursor="pointer"
                      onClick={() => setIsPasswordVisible(true)}
                    />
                  )}
                </InputRightElement>
              </InputGroup>
              {errors && errors.password && (
                <FormHelperText>{errors.password.message}</FormHelperText>
              )}
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
