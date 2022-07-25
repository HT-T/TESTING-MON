import { Center,Box,Text,Flex,Select } from "@chakra-ui/react";
import { useState,useEffect } from "react";

import { collection,getDocs,query,orderBy,limit} from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";

export default function Scoreboard() {			 
	const [scoreList,setScoreList] = useState([]);
	const {db} = useAuth();
	//获取排行数据
	const request =(nums)=>{
		setScoreList([])
		let connect = collection(db, "users");
		const reslut= query(connect,orderBy('time','asc'),limit(nums));
		getDocs(reslut).then(snapshot=>{
			let arr = [];
			snapshot.forEach((doc)=>{
				arr.push({
					id:doc.id,
					name:doc.data().name,
					time:doc.data().time
				})
			})
			arr.sort((a,b)=>(b.time-a.time));
			setScoreList(arr);
		});
	}
	
	useEffect(() => {
		request(5);
	}, []);// eslint-disable-line
	
	const changeHandle = (val)=>{
		request(val);
	}
	
	return (
		<Center h="calc(100vh - 56px)" w="100%" bg="#f2f2f2">
			<Box  padding='4' h="calc(100vh - 56px)" w="1000px" bg='#ffffff' color='#333' style={{'overflowY': 'scroll','padding':'30px'}}>
				<Flex justifyContent={'flex-end'}>
					<Select w={100} size='sm' onChange={(e)=>changeHandle(e.target.value)}>
					  <option value='5'>5</option>
					  <option value='10'>10</option>
					  <option value='20'>20</option>
					</Select>
				</Flex>
				<Center style={{marginBottom:'20px',fontWeight:'600'}}>
					<Text fontSize="3xl">Scorebord For Last 7 Days</Text>
				</Center>
				<Flex style={{fontWeight:'600','borderBottom':'1px solid #ededed',padding:'10px 0'}}>
				  <Center flex="1">
					<Text>Name</Text>
				  </Center>
				  <Center flex="1">
					<Text>Focus Time</Text>
				  </Center>
				</Flex>
				<Box color="#888">
				{scoreList.length>0?scoreList?.map((item) => (
					<Flex key={item.id} style={{'borderBottom':'1px solid #ededed',padding:'10px 0'}}>
						<Center flex="1">
							<Text>{item.name}</Text>
						</Center>
						<Center flex="1">
							<Text>{("0" + Math.floor((item.time / 60000) % 60)).slice(-2)}:{("0" + Math.floor((item.time / 1000) % 60)).slice(-2)}:{("0" + ((item.time / 10) % 100)).slice(-2)}</Text>
						</Center>
					</Flex>)):<Center p="30px"><Text>No Data...</Text></Center>} 
				</Box>
			</Box>
		</Center>);
}
