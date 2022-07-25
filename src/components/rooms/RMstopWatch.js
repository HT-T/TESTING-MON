import React, { useState, useEffect,useRef } from "react";
import { doc,updateDoc, query, where,collection,getDocs} from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { Text,Flex,Center,ButtonGroup,Button } from "@chakra-ui/react";
import "./RMstopWatch.css";

const Stopwatch = () => {
  const { db,user } = useAuth();
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const TimeArray = useRef([]);
  
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!running) {
		let connect = collection(db, "users");
		const reslut= query(connect,where('uid','==',user.uid));
		getDocs(reslut).then(snapshot=>{
			snapshot.forEach(async (docs)=>{
				if(!time)return;
				TimeArray.current = docs.data().time;
				let isExist = docs.data().time.some((item)=>{
					return item.id == new Date().getDate();
				});
				if(isExist){
					TimeArray.current.forEach((item)=>{
						if(item.id == new Date().getDate()){
							item.times += time;
						}
					})
				}else{
					if(TimeArray.current.length >= 7){
						TimeArray.current.splice(0,1);
					}
					TimeArray.current.push({
						id:new Date().getDate(),
						times:time
					})
				}
				await updateDoc(doc(db, "users",user.uid),{
				    time:TimeArray.current,
				});
				setTime(0);
			})
		});
		 
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running,db,time,user.uid]);
  
  return (
    <div className="stopwatch">
		<Center>
		  <Flex className="numbers">
			<Text>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</Text>
			<Text>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</Text>
			<Text>{("0" + ((time / 10) % 100)).slice(-2)}</Text>
		  </Flex>
		</Center>
      <Center p={10}>
		<ButtonGroup gap='4'>
	        <Button colorScheme='teal' onClick={() => setRunning(true)}>Start</Button>
			<Button colorScheme='red' onClick={() => setRunning(false)}>Stop</Button>
			<Button onClick={() => setTime(0)}>Reset</Button>  
	     </ButtonGroup>  
      </Center>
	
    </div>
  );
};

export default Stopwatch;