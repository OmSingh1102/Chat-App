import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
const api = "https://chat-app-z4ld.onrender.com";

const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName,setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { user, chats, setChats } = ChatState();
      
    const handleSearch=async (query) => {
         // console.log(query);
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

      setSearchResult(data);
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
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
          toast({
            title: "Please fill all fields!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
        }
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
    
          const { data } = await axios.post(
            `${api}/api/chat/group`,
            {
              name: groupChatName,
              users: JSON.stringify(selectedUsers.map((u) => u._id)),
            },
            config
          );
          setChats([data, ...chats]);
          onClose();
          toast({
            title: "New Group Chat Created!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        } catch (error) {
          toast({
            title: "Failed to Create the Chat!",
            description: error.response.data,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      };
    const handleDelete=(delUser) =>{setSelectedUsers(selectedUsers.filter((sel) => sel._id != delUser._id));
    };
    const handleGroup=(userToAdd) =>{
        if (selectedUsers.includes(userToAdd)) {
            toast({
              title: "User already added",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
          }
      
          setSelectedUsers([...selectedUsers, userToAdd]);
    };
    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
              fontFamily={"Work sans"}
              fontSize="35px"
              display={"flex"}
              justifyContent="center"
            >
                Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody
              display={"flex"}
              alignItems="center"
              flexDirection={"column"}
            >
                <FormControl>
                <Input    
                placeholder={"Chat Name"}
                marginBottom={3}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
                </FormControl>
                <FormControl>
              <Input
                placeholder={"Search User"}
                marginBottom={3}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>

            <Box width={"100%"} display="flex" flexWrap={"wrap"}>
            {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
                
            {loading ? (
              <Spinner />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
                <Button variant='ghost'>Secondary Action</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    );
};

export default GroupChatModal