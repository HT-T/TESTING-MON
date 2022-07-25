import { useAuth } from "../hooks/useAuth";

import {
  Stack,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PageReset () {
  const { sendPasswordReset } = useAuth(); 
  const [email, setEmail] = useState("");
  let navigate = useNavigate();

  return (
    <Container
      maxW="lg"
      py={{
        base: "12",
        md: "24",
      }}
      px={{
        base: "0",
        sm: "8",
      }}
    >
      <Stack spacing="8">
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
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
            </Stack>
            <HStack justify="space-between">
              <Button
                w="30%"
                colorScheme="twitter"
                variant="solid"
                onClick={() => sendPasswordReset(email)}
              >
              Reset
              </Button >
              <Button w="30%" onClick={()=> navigate("/login")}>
                Cancel
              </Button>
            </HStack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}