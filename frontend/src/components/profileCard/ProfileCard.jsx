import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Avatar, Typography, Paper } from "@mui/material";
import { styled } from "@mui/system";

const BlurContainer = styled(Paper)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderRadius: "20px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  overflow: "hidden",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
    border: "2px solid #6a0b3f",
  },
}));

const ProfileCard = () => {
  const { user } = useAuthContext();

  return (
    <Link to={`/profile`} style={{ textDecoration: "none", color: "inherit" }}>
      <BlurContainer>
        <Avatar
          src={user.profilePic}
          sx={{ width: "200px", height: "200px", marginBottom: "10px" }}
        />
        <h1>{user.username}</h1>
        <Typography variant="body1" sx={{ marginBottom: "5px" }}>
          Friends {user.friends.length}
        </Typography>
        <Typography variant="body2" color="gray">
          {user.isPrivate ? "Private Account" : "Public Account"}
        </Typography>
      </BlurContainer>
    </Link>
  );
};

export default ProfileCard;
