import { doc, updateDoc, arrayUnion } from "firebase/firestore";

import {
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState } from "react";
import UserListItem from "../user/UserListItem";
import UserBadgeItem from "../user/UserBadgeItem"

export default function FirendsModal(props) {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const toast = useToast();

  const {users_list, user, db} = props;

  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (!query) {
      return;
    }
    console.log("query", query);
    setLoading(true);
    if (query === "" || query === null) {
      return;
    }
    const result = users_list.filter((person) => {
      return person.name?.toLowerCase().startsWith(query.toLowerCase());
    });
    console.log("result", result);
    setSearchResult(result);
    setLoading(false);
  };
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel.uid !== delUser.uid));
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      setSelectedUsers([...selectedUsers, userToAdd]);
      setQuery("");
    }
    
  };
  const handleAddFriends = () => {
    if (!selectedUsers) {
      toast({
        title: "No user to add",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    console.log("selected",selectedUsers)
    selectedUsers.forEach(async (u) => {
      const ref = doc(db, "friends", u.uid);
      console.log("u",u.uid);
      await updateDoc(ref, {
        friendRequest: arrayUnion(user.uid)
      });
    }) 
    onClose();
    toast({
      title: "Request submitted!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
}

  return (
    <>
      <Button 
        d="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        rightIcon={<AddIcon />}
        onClick={onOpen}
      >
      Add friends 
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add friend</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <FormControl mt={2}>
              <FormLabel>Add user</FormLabel>
              <Input value={query} placeholder="Add users" mb={3} onChange={handleSearch} />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem u={u} handleDelete={() => handleDelete(u)} />
              ))}
            </Box>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : searchResult.length > 0 ? (
              searchResult
                .slice(0, 5)
                .map((u) => (
                  <UserListItem u={u} handleGroup={() => handleGroup(u)} />
                ))
            ) : (
              <Box mt="15px" ml="20px">
                No user found
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => handleAddFriends()}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
      )
}
