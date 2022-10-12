import React, { useState } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { SidebarWithHeader } from "../components/SidebarWithHeader";
import {
  Avatar,
  AvatarBadge,
  IconButton,
  Button,
  FormControl,
  FormHelperText,
  Input,
  Stack,
  FormLabel,
  InputGroup,
  InputRightElement,
  Box,
} from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import updateUserSchema from "../validations/updateUserSchema";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { formatCellphone } from "../utils/formatter";
import { User } from "../types/User";

const Profile: NextPage = () => {
  const { user, updateUser, handleRemoveUserAvatar, handleChangeUserAvatar } =
    useAuth();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const defaultValues = {
    name: user?.name,
    username: user?.username,
    email: user?.email,
    phone: user?.phone ?? null,
    role: user?.role,
    password: null,
  };

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<User>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    resolver: yupResolver(updateUserSchema),
    defaultValues,
  });

  const values = watch();

  if (values.phone === "") setValue("phone", null);
  if (values.password === "") setValue("password", null);

  const { status, mutate } = useMutation(() => updateUser(values), {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });

  return (
    <>
      <Head>
        <title>Meu perfil</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SidebarWithHeader>
        <Stack
          as="form"
          onSubmit={handleSubmit(() => mutate())}
          spacing={4}
          role="profile/stack"
        >
          <Box>
            <Stack mt={4}>
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
            </Stack>

            <Stack mt={5}>
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
            </Stack>

            <Stack mt={5}>
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
            </Stack>
            <Box>
              <Stack mt={4}>
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
              </Stack>

              <Stack mt={5}>
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
              </Stack>
            </Box>
            <Stack
              mt={30}
              spacing={8}
              isInline
              justifyContent="flex-start"
              alignItems="center"
            >
              <Avatar src={user?.avatar} size="xl">
                {user?.avatar === null ? (
                  false
                ) : (
                  <AvatarBadge
                    onClick={handleRemoveUserAvatar}
                    as={IconButton}
                    size="md"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="Remove Image"
                    icon={<IoCloseOutline />}
                  />
                )}
              </Avatar>
              <Button>
                Alterar
                <Input
                  type="file"
                  position="absolute"
                  opacity="0"
                  aria-hidden="true"
                  accept="image/*"
                  style={{ cursor: "pointer" }}
                  onChange={(e) => {
                    if (e.target.files)
                      handleChangeUserAvatar(e.target.files[0]);
                  }}
                />
              </Button>
            </Stack>
          </Box>

          <Stack isInline justifyContent="flex-end" alignItems="center">
            <Button
              type="submit"
              isLoading={status === "loading"}
              colorScheme={"blue"}
            >
              Salvar
            </Button>
          </Stack>
        </Stack>
      </SidebarWithHeader>
    </>
  );
};

export default Profile;
