import React,{useState} from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { Button,IconButton } from "@chakra-ui/button";
import { ViewIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner
  } from '@chakra-ui/react';
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain,setFetchAgain,fetchMessages })=> {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName,setGroupChatName] = useState();
    const [search,setSearch] = useState("");
    const [searchResult,setSearchResult] = useState([]);
    const [loading,setLoading] = useState(false);
    const [renameLoading,setRenameLoading] = useState(false);

    const toast = useToast();

    const { selectedChat,setSelectedChat,user } = ChatState();

    const handleRemove= async(user1)=>{
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only Admin can remove a user from Group!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                "/api/chat/groupRemove",
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
                );

                user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
                setFetchAgain(!fetchAgain);
                fetchMessages();
                setLoading(false);
        } 
        catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message ,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            setLoading(false);
        }
    }

    const handleRename= async()=>{
        if(!groupChatName) return;
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put("/api/chat/rename",{
                chatId: selectedChat._id,
                chatName: groupChatName,
            },config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        }
         catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message ,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setRenameLoading(false)
        }
        setGroupChatName("");
    };

    const handleSearch = async(query)=>{
        setSearch(query);
        if(!query) {
            return;
        }
        try {
            setLoading(true);
            const  config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data }  = await axios.get(`/api/user?search=${search}`,config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: "Failed to load the Search Results",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
        }
    }

    const handleAddUser= async(user1)=>{
        if(selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User already in Group",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            return;
        }

        if(selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only Admin can add a user to Group!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                "/api/chat/groupAdd",
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
                );
                setSelectedChat(data);
                setFetchAgain(!fetchAgain);
                setLoading(false);
        } 
        catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message ,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            setLoading(false);
        }
    };

    return (
        <>
          <IconButton d={{ base: "flex"}} icon={ <ViewIcon/>} onClick={onOpen}/>
    
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontSize="35px"
                fontFamily="Work sans"
                d="flex"
                justifyContent="center"
              >{ selectedChat.chatName}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                  <Box w="100%" d="flex" flexWrap="wrap" pb={3} >
                    {selectedChat.users.map((u) => (
                            <UserBadgeItem
                                key={user._id}
                                user = {u}
                                handleFunction = {() => handleRemove(u)}
                            />
                        ))}
                  </Box>
                  <FormControl d="flex">
                      <Input
                        placeholder="Chat Name"
                        mb={3}
                        value={groupChatName}
                        onChange={(e)=>setGroupChatName(e.target.value)}
                      />
                      <Button
                        variant="solid"
                        colorScheme='teal'
                        ml={1}
                        isLoading={renameLoading}
                        onClick={handleRename}
                      >
                          Update
                      </Button>
                  </FormControl>

                  <FormControl d="flex">
                      <Input
                        placeholder="Add user to Group"
                        mb={1}
                        onChange={(e)=>handleSearch(e.target.value)}
                      />
                  </FormControl>
                    { loading ? (
                        <Spinner size="lg" />
                    ) : (
                        searchResult?.map((user) => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={()=> handleAddUser(user)}
                            />
                        ))
                    )}
              </ModalBody>
    
              <ModalFooter>
                <Button onClick={()=>handleRemove(user)} colorScheme='red' >
                  Leave Group
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
};
export default UpdateGroupChatModal;