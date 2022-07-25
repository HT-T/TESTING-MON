import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Flex,
  useBreakpointValue,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
  FormHelperText,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";


import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function PageRegister() {
  const { registerWithEmailAndPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const isErrorName = name === "";
  const isErrorEmail = email === "";
  const isErrorPassword = password === "";

  const toast = useToast();
  const navigate = useNavigate();

  const [isOpen, setOpen] = useState(false);
  const onClickReveal = () => setOpen(!isOpen);



  const handleRegister = async(e) => {
    if (isErrorName) {
      toast({
        title: "Invalid name",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } else {
      await registerWithEmailAndPassword(name, email, password);
      navigate("/");
    }
  };

  return (
    <Container
      maxW="lg"
      py={{
        base: "12",
        md: "24",
      }}
      px={{
        base: "0",
        sm: "5",
      }}
    >
      <Stack spacing="5">
        <Flex alignItems="center">
          <IconButton
            variant="unstyled"
            colorScheme="teal"
            aria-label="back"
            icon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          />
          <Heading
            margin="auto"
            size={useBreakpointValue({
              base: "xs",
              md: "sm",
            })}
          >
            Sign up for new account
          </Heading>
        </Flex>
        <Box
          py={{
            base: "0",
            sm: "8",
          }}
          px={{
            base: "4",
            sm: "10",
          }}
          bg={useBreakpointValue({
            base: "transparent",
            sm: "bg-surface",
          })}
          boxShadow={{
            base: "none",
            sm: useColorModeValue("md", "md-dark"),
          }}
          borderRadius={{
            base: "none",
            sm: "xl",
          }}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl isInvalid={isErrorName}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  vaule={name}
                  type={"text"}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {!isErrorPassword ? (
                  <FormHelperText>Enter display name</FormHelperText>
                ) : (
                  <FormErrorMessage>Name is required.</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={isErrorEmail}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!isErrorEmail ? (
                  <FormHelperText>
                    Enter the email to receive the password reset email.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>Email is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={isErrorPassword}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <InputRightElement>
                    <IconButton
                      variant="link"
                      aria-label={isOpen ? "Mask password" : "Reveal password"}
                      icon={isOpen ? <HiEyeOff /> : <HiEye />}
                      onClick={onClickReveal}
                    />
                  </InputRightElement>
                  <Input
                    id="password"
                    name="password"
                    vaule={password}
                    type={isOpen ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
                {!isErrorPassword ? (
                  <FormHelperText></FormHelperText>
                ) : (
                  <FormErrorMessage>Password is required.</FormErrorMessage>
                )}
              </FormControl>
            </Stack>
            <HStack justify="space-between"></HStack>
            <Stack spacing="6">
              <Button
                colorScheme="twitter"
                variant="solid"
                onClick={(e) => handleRegister(e)}
              >
                Sign up
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}