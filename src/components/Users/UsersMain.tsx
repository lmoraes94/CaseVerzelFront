import React, { ReactNode } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import Lottie from "lottie-react";
import loadingDefaultAnimation from "../../assets/lotties/loadingRequest.json";
import errorDefaultAnimation from "../../assets/lotties/failed.json";
import { useRouter } from "next/router";

type UserMainProps = {
  status: "idle" | "error" | "loading" | "success";
  loadingAnimation?: string;
  errorAnimation?: string;
  children: ReactNode;
};

export const UsersMain = ({
  status,
  loadingAnimation,
  errorAnimation,
  children,
}: UserMainProps) => {
  const { reload } = useRouter();

  if (status === "loading") {
    return (
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Lottie
          animationData={loadingAnimation ?? loadingDefaultAnimation}
          loop
          style={{ width: 300, height: 300 }}
        />
      </Box>
    );
  } else if (status === "error") {
    return (
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
          gap: "24px",
        }}
      >
        <Lottie
          animationData={errorAnimation ?? errorDefaultAnimation}
          loop={false}
          style={{ width: 150, height: 150 }}
        />
        <Text>Erro ao carregar usuários. Tente novamente!</Text>
        <Button onClick={reload}>Recarregar</Button>
      </Box>
    );
  } else return <>{children}</>;
};
