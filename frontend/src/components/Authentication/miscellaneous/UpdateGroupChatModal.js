import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const api = "https://chat-app-z4ld.onrender.com";
const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [renameLoading, setRenameLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    
    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
          toast({
            title: "User already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
          toast({
            title: "Only Admin Can Add Users to Group!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
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
            `${api}api/chat/groupadd`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
          setLoading(false);
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
        } catch (error) {
          toast({
            title: "Error occured!",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        }
      };
      const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
          toast({
            title: "Only admins can remove someone!",
            status: "error",
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
            `${api}/api/chat/groupremove`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
    
          setLoading(false);
          console.log(data);
          user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setLoading(false);
          
           fetchMessages();
          
        } catch (error) {
          toast({
            title: "Error occured!",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      };
    const handleRename = async () => {
        if (!groupChatName) return;
        try {
          setRenameLoading(true);
    
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          // console.log(selectedChat._id);
          const { data } = await axios.put(
            `${api}api/chat/rename`,
            {
              chatId: selectedChat._id,
              chatName: groupChatName,
            },
            config
          );
          console.log(data);
    
          setSelectedChat(data);
          setRenameLoading(false);
          //console.log(fetchAgain);
          setFetchAgain(true);
          //console.log(fetchAgain);
        } catch (error) {
          toast({
            title: "Error occured!",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setRenameLoading(false);
          setGroupChatName("");
        }
      };
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
          return;
        }
        try {
          setLoading(true);
    
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
    
          const { data } = await axios.get(`${api}/api/user?search=${search}`, config);
    
          setSearchResults(data);
          // console.log(searchResults);
          setLoading(false);
        } catch (error) {
          toast({
            title: "Error occured!",
            description: "Failed To load the chats!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      };
  return (
    <>
     <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
    <ModalHeader display={"flex"}
            justifyContent={"center"}
            fontSize="35px"
            fontFamily={"Work sans"}
          >
            {selectedChat.chatName} </ModalHeader>
    <ModalCloseButton />
    <ModalBody 
       display={"flex"}
       width="100%"
       flexWrap={"wrap"}
       paddingBottom={3}
     >
       
       {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleRemove(u)}
              />
            ))}
       <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder={"Add User to Group"}
                marginBottom={3}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>
            {loading ? (
              <Spinner />
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
    </ModalBody>

    <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </>
  );
};

export default UpdateGroupChatModal