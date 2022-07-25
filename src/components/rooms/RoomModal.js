import { setDoc, doc, query, collection, where, onSnapshot, updateDoc, arrayUnion,getDocs} from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";

import {
  Box,
  Switch,
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
  Text,
  Center
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import UserListItem from "../user/UserListItem";
import UserBadgeItem from "../user/UserBadgeItem";
import "./RoomModal.css";
export default function RoomModal() {
  const { user, db } = useAuth();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [codeList, setCodeList] = useState([]);
  const [moduleCode, setModuleCode] = useState('');
  const [focusRoomName, setFocusRoomName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  //const [static_modList, setstatic_modList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [endUser, setEndUser] = useState([]);
  const [isprivateRoom, setIsPrivateRoom] = useState(false);
	
  const [display, setDisplay] = useState(true);
  const handleSearch = (e) => {
    const query = e.target.value;
    if (!query) {
      return;
    }    
	setLoading(true);
    if (query === "" || query === null) {
      return;
    }
    const result = endUser.filter((person) => {
      return person.name?.toLowerCase().startsWith(query.toLowerCase());
    });
    console.log("result", result);
    setSearchResult(result);
    setLoading(false);
  };
  
  const onInput = (value)=>{
	  setModuleCode(value);
	  let connect = collection(db, "static_modList");
	  getDocs(connect).then(snapshot=>{
		  setCodeList(
			  snapshot.docs.map((doc) =>({
			  	moduleCode:doc.data().moduleCode
			  }))
		  )
	  });
	 value&&codeList.length>0?setDisplay(false):setDisplay(true);
  }
  
 

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
    }
  };

  const handleSubmit = async () => {
    if (!focusRoomName || selectedUsers?.length === 0) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const docRef = doc(collection(db, "groups"));
	  console.log(docRef)
      const all_members = selectedUsers.map(u => u.uid).concat(user.uid); 
      const group = {
        createdAt: new Date(),
        createdBy: user.uid,
        members: all_members, 
        id:docRef.id,
        admin: user.uid,
        name:focusRoomName,
        private:isprivateRoom,
		moduleCode:moduleCode
      };

      await setDoc(docRef, group);
      all_members.forEach(async (u) => {
        const ref = doc(db, "users", u);
        console.log("u",u);
        await updateDoc(ref, {
          rooms: arrayUnion(docRef.id)
        });
      }) 
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (e) {
      toast({
        title: "Failed to Create the Chat!",
        description: e.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "users"), where("uid", "!=", user.uid));
    const unsubscribe = onSnapshot(q, (documentSnapShot) => {
      const allUsers = [];
      documentSnapShot.forEach((doc) => {
        allUsers.push(doc.data());
      });
      setEndUser(allUsers);
    });

      setLoading(false);
    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, [db, user?.uid]);

  console.log("endUser", endUser);
  console.log("selectedUser ", selectedUsers);
  
  const chooseCode = (item,e)=>{
	e.preventDefault();
	setModuleCode(item)
	setDisplay(true)
  }
  return (
    <>
      <Button
        d="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        rightIcon={<AddIcon />}
        onClick={onOpen}
      >
        New Focus Room
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create foucs room</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
			  <FormControl>
				<FormLabel>Module Code</FormLabel>
				<Input
				  onInput = {(e) => onInput(e.target.value)}
				  placeholder="Module Code"
				  value={moduleCode}
				  mb={1}
				  isRequired
				/>
				<Box className="box" style={{display:display?'none':''}}>
					{codeList?.map((item,i) =>(
						<Center style={{display:item.moduleCode?.indexOf(moduleCode)>-1?'':'none',}} key={i} className="center" onClick={(e)=>chooseCode(item.moduleCode,e)}>
							<Text>{item.moduleCode}</Text>
						</Center>)
					)}
				</Box>
			  </FormControl>
            <FormControl>
              <FormLabel>Room name</FormLabel>
              <Input
                onChange={(e) => setFocusRoomName(e.target.value)}
                placeholder="Room name"
                mb={1}
                isRequired
              />
            </FormControl>

            <FormControl mt={2}>
              <FormLabel>Add user</FormLabel>
              <Input placeholder="Add users" mb={3} onChange={handleSearch} />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="public-private" mb="0">
                Enable private focus rooms?
              </FormLabel>
              <Switch id="public-private" defaultChecked onChange={()=>setIsPrivateRoom(!isprivateRoom)} />
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
                .slice(0, 4)
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
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create focus room
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
