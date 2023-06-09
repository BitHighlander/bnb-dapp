import { Flex, Link, Text } from "@chakra-ui/react";
import ThemeToggle from "./ThemeToggle";

const Footer = () => {
  return (
    <Flex
      as="footer"
      width="full"
      align="center"
      alignSelf="flex-end"
      justifyContent="center"
    >
      <Text fontSize="xs">
        {new Date().getFullYear()} -{" "}
        <Link href="https://keepkey.com" isExternal>
          keepkey.com
        </Link>
      </Text>
      <ThemeToggle />
    </Flex>
  );
};

export default Footer;
