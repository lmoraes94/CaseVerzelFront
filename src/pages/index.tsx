import React, { useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { loginSchema } from "../validations/loginSchema";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type LoginData = {
  email: string;
  password: string;
};

const Main: NextPage = () => {
  const { Login, isLoading } = useAuth();
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const defaultValues: LoginData = {
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    resolver: yupResolver(loginSchema),
    defaultValues,
  });

  const values = watch();

  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.75 } }}
        exit={{ opacity: 0 }}
        minH="100vh"
        direction={{ base: "column", md: "row" }}
        role="index/stack"
      >
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack
            as="form"
            onSubmit={handleSubmit(() => Login(values.email, values.password))}
            spacing={4}
            w={"full"}
            maxW={"md"}
          >
            <Heading fontSize={"2xl"}>Faça login na sua conta</Heading>
            <FormControl isRequired>
              <FormLabel>E-mail</FormLabel>
              <Input
                {...register("email")}
                focusBorderColor={"blue.500"}
                placeholder="e-mail"
                type="email"
              />
              {errors && errors.email && (
                <FormHelperText>{errors.email.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Senha</FormLabel>
              <InputGroup>
                <Input
                  {...register("password")}
                  focusBorderColor={"blue.500"}
                  placeholder="senha"
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
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"end"}
                justify={"flex-end"}
              >
                <Button
                  mt={10}
                  width="200px"
                  isLoading={isLoading}
                  type="submit"
                  disabled={isLoading}
                  colorScheme="purple"
                  variant="solid"
                >
                  Entrar
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Flex>
      </Stack>
    </>
  );
};

export default Main;
