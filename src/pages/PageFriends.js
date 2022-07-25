import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getDoc, doc, query, collection } from "firebase/firestore";
import { Box, Avatar, Text, Flex, Heading, Stack } from "@chakra-ui/react";
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import FriendRequest from "../components/friends/FriendsRequest";
import FirendsModal from "../components/friends/FriendsModal";

export default function PageFriends() {
  const { user, db } = useAuth();
  //const [friends_list, setFriends_list] = useState([]);
  const [friendsInfo, setFriendsInfo] = useState([]);

  const [friends_list] = useDocumentData(doc(db, "friends", user?.uid));
  console.log("friends_info", friends_list?.friends);
  const q = query(collection(db, "users"));
  const [allUsers] = useCollectionData(q);
  const users_list = allUsers?.filter((u) => u.uid !== user.uid);

  /*
  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "friends", user.uid);
      const querySnapshot = await getDoc(docRef);
      if (querySnapshot.exists()) {
        setFriends_list(querySnapshot.data().friends);
      } else {
        setFriends_list("");
      }
    }
    fetchData();
  }, [db, user.uid]);
  async function test() {
  let element = friends_list[0];
  console.log("uid")
  console.log(element);
  const docRef = doc(db, "users", element);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // eslint-disable-next-line no-const-assign
    console.log(docSnap.data());
  }
}
  test();
  */
  useEffect(() => {
    async function fetch_friends_info() {
      setFriendsInfo([]);
        friends_list.friends?.forEach(async (element) => {
          console.log("uid");
          console.log(element);
          const docRef = doc(db, "users", element);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // eslint-disable-next-line no-const-assign
            console.log("data");
            console.log(docSnap.data());
            setFriendsInfo((friendsInfo) => [...friendsInfo, docSnap.data()]);
          } else {
            console.log("error");
          }
        });
    }
    fetch_friends_info();
  }, [db, friends_list]);

  const listLength = friends_list?.friends.length;
  return (
    <Box p={3}>
    <Heading mb={3}>
      {listLength === 0 ? (
        <div>Number of friend: 0</div>
      ) : (
        <div>
          Number of friends: {listLength}
        </div>
      )}</Heading>
    <Stack direction="row" spacing='20px' mb={4}>
      <FirendsModal users_list={users_list} user={user} db={db}/>
      <FriendRequest users_list={users_list} user={user} db={db}/>
</Stack>
      <Box width= "500px" overflowY="scroll" sx={{scrollbarWidth: "none"}}>
        {friendsInfo?.map((person, index) => (
          <Flex
            key={index + 1}
            cursor="pointer"
            bg="#E8E8E8"
            _hover={{
              background: "#38B2AC",
              color: "white",
            }}
            alignItems="center"
            color="black"
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
          >
            <Avatar
              mr={2}
              size="sm"
              cursor="pointer"
              name={person.name}
              src={person.photoURL}
            />
            <Box>
              <Text>
                {person.name == null ? "No display name" : person.name}
              </Text>
              <Text fontSize="xs">
                <b>Email : </b>
                {person.email}
              </Text>
            </Box>
          </Flex>
        ))}
      </Box>
    </Box>
  );
}