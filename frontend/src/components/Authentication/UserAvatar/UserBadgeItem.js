import { CloseIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    // console.log(user);
    return (
      <Box
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        fontSize={12}
        backgroundColor="#8259d3"
        cursor={"pointer"}
        onClick={handleFunction}
        display="flex"
      >
        <Text color={"white"}>{user.name}</Text>
        <CloseIcon color={"white"} pl={1} pt={1.5} />
      </Box>
    );
};  
export default UserBadgeItem