import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { usePostContext } from "../../hooks/usePostContext";
import { formatDistanceToNow } from "date-fns";

import {
  Avatar,
  IconButton,
  TextField,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Comment from "../comment/Comment";
import { styled } from "@mui/system";

const FrostedPaper = styled(Paper)(({ theme }) => ({
  padding: "16px",
  borderRadius: "20px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  margin: "20px",
}));

const Posts = ({ post }) => {
  const { dispatch } = usePostContext();
  const { user } = useAuthContext();
  const [isComment, setIsComment] = useState(false);
  const [comment, setComment] = useState("");

  const handleDelete = async () => {
    const response = await fetch(`/posts/${post._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.ok) {
      dispatch({ type: "DELETE_POST", payload: post._id });
    } else {
      const error = await response.json();
      console.error(error);
    }
  };

  const handleLike = async () => {
    const response = await fetch(`/posts/${post._id}/like`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ _id: user._id }),
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "LIKE_POST", payload: json });
    } else {
      console.error(json.message);
    }
  };

  const handleComment = async () => {
    const response = await fetch(`/posts/${post._id}/comments`, {
      method: "PATCH",
      body: JSON.stringify({ _id: user._id, content: comment }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "COMMENT_POST", payload: json });
      setComment("");
      setIsComment(false);
    } else {
      console.error(json.message);
    }
  };

  const handleRequest = async () => {
    const response = await fetch(
      `/user/${user._id}/friend-request/${post.author._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (response.ok) {
      console.log("Request successfully sent");
    } else {
      console.error(json.message);
    }
  };

  return (
    <FrostedPaper elevation={0}>
      <div
        className="post-header"
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <Avatar
          src={post.author.profilePic}
          sx={{ width: "50px", height: "50px" }}
        />
        <Typography variant="h6" sx={{ marginLeft: "10px" }}>
          {post.author.username}
        </Typography>
        <div
          style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginRight: "10px" }}
          >
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </Typography>
          {user && user._id === post.author._id && (
            <IconButton onClick={handleDelete}>
              <DeleteOutlinedIcon sx={{ color: "red" }} />
            </IconButton>
          )}
          {user.friends.find((friend) => friend._id !== post.author._id) &&
            user._id !== post.author._id &&
            user.friendRequests.find(
              (requested) => requested._id !== post.author._id
            ) && (
              <IconButton onClick={handleRequest}>
                <PersonAddIcon />
              </IconButton>
            )}
        </div>
      </div>

      {post.mediaUrl && (
        <div className="post-image-container">
          <img
            src={post.mediaUrl}
            alt="Post"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </div>
      )}
      <Typography variant="body1" sx={{ fontWeight: "bold", margin: "10px 0" }}>
        {post.caption}
      </Typography>
      <div
        className="post-actions"
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <div
          className="action-item"
          style={{ display: "flex", alignItems: "center", marginRight: "15px" }}
        >
          <IconButton onClick={handleLike}>
            <FavoriteIcon sx={{ color: "#6a0b3f" }} />
          </IconButton>
          <Typography variant="body2" sx={{ marginLeft: "5px" }}>
            {post.likes ? Object.keys(post.likes).length : 0}
          </Typography>
        </div>
        <div
          className="action-item"
          style={{ display: "flex", alignItems: "center" }}
        >
          <IconButton onClick={() => setIsComment(!isComment)}>
            <ChatBubbleIcon sx={{ color: "#6a0b3f" }} />
          </IconButton>
          <Typography variant="body2" sx={{ marginLeft: "5px" }}>
            {post.comments ? post.comments.length : 0}
          </Typography>
        </div>
      </div>

      {isComment && (
        <div className="comment-section">
          <div className="comments" style={{ marginBottom: "10px" }}>
            {post.comments &&
              post.comments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
          </div>

          <TextField
            variant="outlined"
            fullWidth
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            sx={{
              borderRadius: "20px",
              marginBottom: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
              "& .MuiInputLabel-root": {
                color: "grey",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleComment}
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              fontSize: "14px",
              padding: "8px",
              backgroundColor: "#6a0b3f",
            }}
          >
            Comment
          </Button>
        </div>
      )}
    </FrostedPaper>
  );
};

export default Posts;
