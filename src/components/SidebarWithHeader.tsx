import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useMediaQuery,
  useColorMode,
  Tooltip,
} from "@chakra-ui/react";
import { FiUsers, FiMenu, FiChevronDown } from "react-icons/fi";
import { IoCarSport } from "react-icons/io5";
import { FaSun, FaMoon } from "react-icons/fa";
import { IconType } from "react-icons";
import { ReactText } from "react";
import { useAuth } from "../hooks/useAuth";
import Image from "next/image";

type LinkItemProps = {
  name: string;
  pageLink: string;
  icon: IconType;
};

const LinkItems: Array<LinkItemProps> = [
  { name: "Usuários", pageLink: "/users", icon: FiUsers },
  { name: "Veículos", pageLink: "/cars", icon: IoCarSport },
];

export const SidebarWithHeader = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("purple.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { colorMode } = useColorMode();

  return (
    <>
      <Box
        transition="3s ease"
        bg={useColorModeValue("purple.300", "gray.900")}
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.700")}
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="4" justifyContent="space-between">
          <Image
            alt="Logo"
            src={"/static/images/logo.svg"}
            width={200}
            height={70}
          />
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        <Flex
          h={"calc(100% - 80px)"}
          flexDirection={"column"}
          overflowY={"auto"}
        >
          {LinkItems?.map((link) => (
            <NavItem key={link.name} icon={link.icon} pageLink={link.pageLink}>
              {link.name}
            </NavItem>
          ))}
        </Flex>
      </Box>
    </>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  pageLink: string;
  children: ReactText;
}

const NavItem = ({ pageLink, icon, children, ...rest }: NavItemProps) => {
  const router = useRouter();

  const isCurrentLinkSelected = router.pathname === pageLink;

  return (
    <Link
      onClick={() => router.push(pageLink)}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        role="group"
        cursor="pointer"
        bg={isCurrentLinkSelected ? "purple.500" : ""}
        color={isCurrentLinkSelected ? "#fff" : ""}
        borderRight={isCurrentLinkSelected ? "5px solid purple" : ""}
        _hover={{
          bg: "purple.500",
          color: "purple.300",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "#fff",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { user, Logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  const [downMd] = useMediaQuery("(max-width: 48em)");

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("purple.300", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <HStack spacing={{ base: "0", md: "6" }}>
        <Tooltip
          label={colorMode === "dark" ? "Ligar a luz" : "Desligar a luz"}
        >
          <IconButton
            sx={downMd ? { marginRight: "16px" } : {}}
            value={colorMode}
            icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
            aria-label="Color mode"
            onClick={toggleColorMode}
          />
        </Tooltip>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"} src={user?.avatar} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{user?.name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {user?.role}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("#fff", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={() => router.push("/profile")}>
                Perfil
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={Logout}>Sair</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
