import React, { useRef, useState } from "react";
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
import createUserSchema from "../../validations/createUserSchema";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../../services/api";
import { formatCellphone } from "../../utils/formatter";

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AddUserData = {
  name: string;
  username: string;
  email: string;
  phone: string | null;
  role: "Admin" | "User";
  password: string;
};

export const AddUserModal = ({ isOpen, onClose }: AddUserModalProps) => {
  const toast = useToast();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const queryClient = useQueryClient();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const defaultValues: AddUserData = {
    name: "",
    username: "",
    email: "",
    phone: null,
    password: "",
    role: "User",
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddUserData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    resolver: yupResolver(createUserSchema),
    defaultValues,
  });

  const values = watch();

  if (values.phone === "") setValue("phone", null);

  const handleCreateUser = async () => {
    const data = {
      name: values.name,
      username: values.username,
      email: values.email,
      phone: values.phone,
      password: values.password,
      role: values.role,
    };

    const response = await api.post("/users", data);

    return response;
  };

  const { status, mutate } = useMutation(handleCreateUser, {
    onSuccess: ({ data }) => {
      toast({
        title: "Sucesso.",
        description: data?.message,
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
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
        <ModalHeader>Adicionar novo usuário</ModalHeader>
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

            <FormControl isRequired>
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
