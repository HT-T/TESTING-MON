import { useAuth } from "../hooks/useAuth";
import RoomModal from "../components/rooms/RoomModal"
import { Text, Box, Flex, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function PageRoom() {
  const { user, db } = useAuth();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectRoom,setSelectRoom] = useState("");
  const navigate = useNavigate();
	
  useEffect(() => {
    const q = query(
      collection(db, "groups"),
      where("members", "array-contains", user?.uid)
    );
    const unsubscribe = onSnapshot(q, (documentSnapShot) => {
      const allGroups = [];
      documentSnapShot.forEach((doc) => {
        allGroups.push(doc.data());
      });
      setGroups(allGroups);
    });

    if (loading) {
      setLoading(false);
    }
    return () => unsubscribe();
  }, [db, user?.uid, loading]);

  console.log("groups", groups);

  const handleSelectRoom = (room) => {
    setSelectRoom(room);
	console.log(selectRoom);
    navigate("/focusroom", {state:{r_id:room.id, u_id:user.uid}});
  }
  
  return (
    <Flex
      flexDir="column"
      p={3}
      bg="white"
      mt="5"
      ml="3"
      w={{ base: "100%", md: "50%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Flex
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>My focus rooms</Text>
        <RoomModal />
      </Flex>
      {groups.length > 0 ? (
        <Stack overflowY="scroll">
          {groups.map((room, index) => (
            <Box key={index + 1} 
              mb="3"
              onClick={() => handleSelectRoom(room)}
              cursor="pointer"
              _hover={{background: "#38B2AC",color: "white"}}
              bg= {"#E8E8E8"}
              color={"black"}
              px={3}
              py={2}
              borderRadius="lg"
            >
              <Text fontSize="4xl">{room.name}</Text>
              <Text>Room size: {room.members?.length}</Text>
              <Text>Room type: {room.private ? "private" : "public"}</Text>
            </Box>
          ))}
        </Stack>
      ) : (
        <Text>No groups created</Text>
      )}
    </Flex>
  );
}