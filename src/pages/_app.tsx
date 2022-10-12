import type { AppProps } from "next/app";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "../contexts/auth";
import { useAuth } from "../hooks/useAuth";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Lottie from "lottie-react";
import animation from "../assets/lotties/rocket.json";

const ApiProvider = ({ Component, pageProps }: AppProps) => {
  const { isLoading } = useAuth();

  return (
    <AuthProvider>
      {isLoading ? (
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
            animationData={animation}
            loop
            style={{ width: 300, height: 300 }}
          />
        </Box>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
};

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <ApiProvider
            Component={Component}
            pageProps={pageProps}
            router={router}
          />
        </ChakraProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default MyApp;
