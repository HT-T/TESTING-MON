import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import UserListItem from "../user/UserListItem";

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
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

export default function FriendRequest(props) {
  const { users_list, user, db } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [request_uid_list] = useDocumentData(doc(db, "friends", user?.uid));
  console.log("request_uid_list", request_uid_list);
  console.log("users_list", users_list);
  const request_user = users_list?.filter((u) =>
    request_uid_list?.friendRequest?.includes(u.uid)
  );
  console.log("reqeust_user", request_user);

  const ownRef = doc(db, "friends", user.uid);
  const handleAccept = async (u) => {
    await updateDoc(ownRef, {
      friends: arrayUnion(u.uid)
    });
    const friend_ref  = doc(db, "friends", u.uid);
    await updateDoc(friend_ref, {
      friends: arrayUnion(user.uid)
    });
    handleReject(u);
  };

  const handleReject = async (u) => {
    await updateDoc(ownRef, {
      friendRequest: arrayRemove(u.uid)
    });
  };

  return (
    <>
      <Button
        d="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        onClick={onOpen}
      >
        Friends request
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Friend request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {
              // <ChatLoading />
              request_user?.length > 0 ? (
                request_user.map((u) => (
                  <Flex alignItems="center" justifyContent="space-between">
                    <UserListItem u={u} />
                    <IconButton
                      size="lg"
                      m={3}
                      icon={<CheckIcon />}
                      onClick={() => handleAccept(u)}
                    />
                    <IconButton
                      size="lg"
                      m={3}
                      icon={<CloseIcon />}
                      onClick={() => handleReject(u)}
                    />
                  </Flex>
                ))
              ) : (
                <Box mt="15px" ml="20px">
                  No request available.
                </Box>
              )
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}