import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Flex,
  Box,
  Spacer,
  Heading,
  Button,
} from "@chakra-ui/react";

import { Link, useNavigate} from "react-router-dom";

import { useAuth } from "./hooks/useAuth";
import React from "react";

export default function Navbar() {
  const { user, signout } = useAuth();
  let navigate = useNavigate();

  const handleLogout = async () => {
    await signout();
    navigate("/login");
  };
  const routeChange = (e, path) => {
    e.preventDefault();
    navigate(path);
  }

  return (
    <Flex
      minWidth="max-content"
      alignItems="flex-center"
      gap="2"
      bg="teal.200"
      padding={2}
    >
      <Box p="2">
        <Heading size="md">
          <Link to="/">StudyTogether</Link>
        </Heading>
      </Box>

      {user && (
        <>
          <Button colorScheme="teal" variant="ghost" onClick={(e) => routeChange(e, "/modules")}>Modules</Button>
          <Button colorScheme="teal" variant="ghost" onClick={(e) => routeChange(e, "/friends")}>
          Friends
          </Button>
          <Button colorScheme="teal" variant="ghost" onClick={(e) => routeChange(e, "/timer")}>Timer</Button>
		  <Button colorScheme="teal" variant="ghost" onClick={(e) => routeChange(e, "/scoreboard")}>scoreboard</Button>
          <Spacer />
          <Menu>
            <MenuButton mr={5}>
              <Avatar size="sm" />
            </MenuButton>
            <MenuList>
              <MenuGroup title="Profile">
                <MenuItem>My Account</MenuItem>
                <MenuItem onClick={() => handleLogout()}>Sign out</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </>
      )}
    </Flex>
  );
}
