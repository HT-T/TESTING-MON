import React, {
	useState,
	useEffect
} from "react";
import {
	useNavigate
} from "react-router-dom";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {
	query,
	orderBy,
	collection,
	doc,
	getDocs,
	deleteDoc,
	addDoc,
	endAt,
	startAt,
	where
} from "firebase/firestore";
import {
	useAuth
} from "../../hooks/useAuth";
import {
	Input,
	Center,
	Button,
	Box,
	useDisclosure,
	Flex,
	Text,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	useToast
} from '@chakra-ui/react'
import {
	SearchIcon
} from '@chakra-ui/icons'

import './modules.css'

function Modules() {
	const toast = useToast();
	const navigate = useNavigate();
	const {
		user,
		db
	} = useAuth();
	const {
		isOpen,
		onOpen,
		onClose
	} = useDisclosure();
	const cancelRef = React.useRef();
	const [searchKey, setSearchKey] = useState('');
	const [id, setId] = useState("");

	const [user_modList, setuser_modList] = useState({});
	const [groups_modList, setGroups_modList] = useState([]);
	
	const [moduleCode, setModuleCode] = useState('');
	const [display, setDisplay] = useState(true);
	const [codeList, setCodeList] = useState([]);

	useEffect(() => {
		getStaticData('');
		getUsrData();

	}, []); // eslint-disable-line
	
	const onInput = (value)=>{
		setModuleCode(value);
		getStaticData(value);
	}
	
	const chooseCode = (item,e)=>{
		e.preventDefault();
		setModuleCode(item)
		setDisplay(true)
	}
	
	const getStaticData = (value)=>{
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
	
	const getUsrData = () => {
		console.log(user.uid)
		const connect = collection(db, "user_modList");
		const result = query(connect,where('uid','==',user.uid));
		getDocs(result).then(snapshot => {
			var arr = [];
			snapshot.docs.forEach((doc) => {
				console.log(doc.data());
				arr.push({
					id: doc.id,
					moduleCode: doc.data().mod_code
				})
			})
			setuser_modList(arr);
		});
	};


	// above for displaying static_mods
	const submit = () => {
		let reslut = user_modList.some((item)=>{
			if (item.moduleCode === moduleCode) {
				return true
			}else{
				return false
			}
		}) 

		if (reslut) {
			toast({
				title: "Module Code Already Added",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			return
		}

		addDoc(collection(db, "user_modList"), {
			uid:user.uid,
			mod_code: moduleCode
		});
		setuser_modList({});
		getUsrData();
	};

	// >> update Data
	// const updateData = (e) => {
	// 	e.preventDefault();
	// 	updateDoc(doc(db, "user_modList",dataIdToBeUpdated),{
	// 	    mod_code: updatedmoduleCode,
	// 	    mod_title: updatedmoduleTitle,
	// 	});
	// 	setUpdatedmoduleTitle("");
	// 	setUpdatedmoduleCode("");
	// 	setDataIdToBeUpdated("");
	// };

	const deleteData = (id) => {
		deleteDoc(doc(db, "user_modList", id));
		getUsrData();
	};

	const searchHandle = () => {
		let connect = collection(db, "groups");
		const reslut = query(connect, orderBy('moduleCode'), startAt(searchKey), endAt(searchKey + "\uf8ff"));
		getDocs(reslut).then(snapshot => {
			var arr = [];
			snapshot.forEach((doc) => {
				arr.push({
					id: doc.id,
					moduleCode: doc.data().moduleCode,
					name: doc.data().name,
					private: doc.data().private
				})
			})
			setGroups_modList(arr);
		});
	};
	const joinHandle = (id) => {
		setId(id);
		onOpen();
	};

	const JoinIn = () => {
		onClose()
		navigate("/focusroom", {
			state: {
				r_id: id,
				u_id: user.uid
			}
		});
	}

	return (<div>
		<Flex h = "calc(100vh - 56px)" w = "100%" bg = "#f2f2f2" >
			<Box w = {'50%'} flex = {1} style = {{borderRight: '1px solid #ccc',overflow: 'scroll'}}>
				<Center p={5} style={{fontWeight:'bold',fontSize:'20px'}}>Add Module Code</Center>
				<Flex style = {{padding: '0 30px 30px 30px'}}>
					<Box className="mainBox">
						<Input className="inputCode" onInput = {(e) => onInput(e.target.value)} placeholder="Module Code" value={moduleCode} mb={1}/>
						<Box className="box" style={{display:display?'none':''}}>
							{codeList?.map((item,i) =>(
								<Center style={{display:item.moduleCode?.indexOf(moduleCode)>-1?'':'none',}} key={i} className="center" onClick={(e)=>chooseCode(item.moduleCode,e)}>
									<Text>{item.moduleCode}</Text>
								</Center>)
							)}
						</Box>
					</Box>
					<Button className = "button"colorScheme = 'red' onClick = {(e) => (submit())}> Add Code </Button> 
				</Flex> 
				<Center>
					{user_modList.length > 0 ? (
					<Center w = "100%" bg = "#f2f2f2">
						<Box padding = '4' w = "1000px" bg = '#ffffff' color = '#333' style = {{'overflowY': 'scroll','padding': '30px'}}>
							<Flex style = {{fontWeight: '600','borderBottom': '1px solid #ededed',padding: '10px 0'}}>
								<Center flex = {1}>
									<Text> Module Code </Text> 
								</Center>
								<Center flex = {1}>
									<Text>Action</Text> 
								</Center> 
							</Flex> 
							<Box color = "#888"> 
								{user_modList?.map((item) => (
								<Flex className = "flex" key = {item.id} style = {{'borderBottom': '1px solid #ededed',padding: '10px 0'}} >
									<Center flex = {1}>
										<Text>{item.moduleCode}</Text> 
									</Center> 
									<Center flex = {1}>
										<Button className = "joinIn" colorScheme = 'red' size = 'sm' onClick = {(e) => (deleteData(item.id))}>Delete</Button> 
									</Center> 
								</Flex>))}  
							</Box> 
						</Box>
					</Center> ): 'No Data...'} 
				</Center> 
			</Box> 
			<Box w = {'50%'} flex = {1} style = {{overflow: 'scroll'}}>
				<Center p={5} style={{fontWeight:'bold',fontSize:'20px'}}>Search Room</Center>
				<Flex style = {{padding: '0 30px 30px 30px'}}>
					<Input placeholder = "Room name" onChange = {(e) => setSearchKey(e.target.value)} className = "input" />
					<Button className = "button" leftIcon = {<SearchIcon />} colorScheme = 'teal' onClick = {searchHandle}>Search</Button>
				</Flex> 
				<Center>{groups_modList.length > 0 ? ( 
					<Center w = "100%" bg = "#f2f2f2">
						<Box padding = '4' w = "1000px" bg = '#ffffff' color = '#333' style = {{'overflowY': 'scroll','padding': '30px'}}>
							<Flex style = {{fontWeight: '600','borderBottom': '1px solid #ededed',padding: '10px 0'}}>
								<Center flex = {1}>
									<Text>Module Code</Text> 
								</Center> 
								<Center flex = {1}>
									<Text>Room Name</Text>
								</Center > 
								<Center flex = {1}>
									<Text>Action</Text> 
								</Center> 
							</Flex> 
						<Box color = "#888">
							{groups_modList?.map((item) => (
								<Flex className = "flex" key = {item.id} style = {{'display': item.private ? 'none' : '','borderBottom': '1px solid #ededed',padding: '10px 0'}}>
									<Center flex = {1}>
										<Text>{item.moduleCode}</Text> 
									</Center> 
									<Center flex = {1}>
										<Text>{item.name}</Text> 
									</Center> 
									<Center flex = {1}>
										<Button className = "joinIn" colorScheme = 'teal' size = 'sm' onClick = {(e) => (joinHandle(item.id))}> Join Room </Button>
									</Center > 
								</Flex>))}
						</Box>
					</Box>
				</Center>): 'No Data...'} 
			</Center>
		</Box>
	</Flex>
	<AlertDialog isOpen = {isOpen} leastDestructiveRef = {cancelRef}onClose = {onClose}>
		<AlertDialogOverlay >
			<AlertDialogContent >
				<AlertDialogHeader fontSize = 'lg' fontWeight = 'bold' > Join Room </AlertDialogHeader>
				<AlertDialogBody>Are you sure you want to join the room ? </AlertDialogBody> 
				<AlertDialogFooter>
					<Button className = "joinIn" ref = {cancelRef} onClick = {onClose} >Cancel</Button> 
					<Button className = "joinIn" colorScheme = 'teal' onClick = {(e) => JoinIn()} ml = {3}>Join</Button> 
				</AlertDialogFooter> 
			</AlertDialogContent> 
		</AlertDialogOverlay>
	</AlertDialog>
	</div>)
}

export default Modules;
