import React from "react";
import { Avatar, Box, Typography } from "@mui/material";

const Comment = ({ comment }) => {
  return (
    <Box display="flex" alignItems="flex-start" marginBottom="8px">
      <Avatar src={comment.author.profilePic} />
      <Box marginLeft="8px">
        <Typography variant="body2" fontWeight="bold">
          {comment.author.username}
        </Typography>
        <Typography variant="body2">{comment.content}</Typography>
      </Box>
    </Box>
  );
};

export default Comment;
