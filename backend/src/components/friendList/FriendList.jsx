import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Avatar, Box, CircularProgress, Typography } from "@mui/material";

const FriendList = () => {
  const { user } = useAuthContext();
  const [friendsData, setFriendsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`/user/${user._id}/friends`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFriendsData(data.friends);
          setLoading(false);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    if (user) {
      fetchFriends();
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
    <div className="friend-list">
      {friendsData.length === 0 ? (
        <Typography>No friends yet!</Typography>
      ) : (
        friendsData.map((friend) => (
          <Box
            key={friend._id}
            display="flex"
            alignItems="center"
            marginBottom={2}
            padding={2}
            className="friend-friend-item"
          >
            <Avatar src={friend.profilePic} />
            <Typography marginLeft={1}>{friend.username}</Typography>
          </Box>
        ))
      )}
    </div>
  );
};

export default FriendList;
