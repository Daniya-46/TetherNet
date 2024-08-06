import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useAuthContext } from "../../hooks/useAuthContext";

const FriendRequests = () => {
  const { user } = useAuthContext();
  const [requests, setRequests] = useState(user.friendRequests);
  const [loading, setLoading] = useState(true);

  const handleAcceptRequest = async (request) => {
    try {
      const response = await fetch(
        `/user/${user._id}/friends/${request}/accept`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        setRequests(json);
        setLoading(false);
        console.log("Request accepted");
      }
    } catch (error) {
      console.error("Error accepting request:", error.message);
    }
  };

  const handleRejectRequest = async (request) => {
    try {
      const response = await fetch(
        `/user/${user._id}/friends/${request}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        setRequests(json);
        setLoading(false);
        console.log("Request rejected");
      }
    } catch (error) {
      console.error("Error rejecting request:", error.message);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`/user/${user._id}/friend-requests`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const reqData = await response.json();

        if (response.ok) {
          setRequests(reqData.friendRequests);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in friend requests: ", error);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="inherit"
      >
        <CircularProgress sx={{ color: "#6a0b3f" }} />
      </Box>
    );
  }

  return (
    <div className="friend-requests">
      {requests.length === 0 ? (
        <Typography>No friend requests</Typography>
      ) : (
        requests.map((request) => (
          <Box
            key={request._id}
            display="flex"
            alignItems="center"
            marginBottom={2}
            className="friend-request-item"
          >
            <Avatar src={request.profilePic} />
            <Typography marginLeft={2}>{request.username}</Typography>
            <Button
              onClick={() => handleAcceptRequest(request._id)}
              variant="contained"
              color="primary"
              sx={{ marginLeft: 2, backgroundColor: "#6a0b3f" }}
            >
              Accept
            </Button>
            <Button
              onClick={() => handleRejectRequest(request._id)}
              variant="contained"
              color="primary"
              sx={{ marginLeft: 2, backgroundColor: "#6a0b3f" }}
            >
              Reject
            </Button>
          </Box>
        ))
      )}
    </div>
  );
};

export default FriendRequests;
