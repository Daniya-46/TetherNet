import React, { useEffect, useState } from "react";
import Posts from "../../components/posts/Posts";
import { useAuthContext } from "../../hooks/useAuthContext";
import NewPostForm from "../../components/newPostForm/NewPostForm";
import { Avatar, IconButton, Button, Grid, Box } from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import FriendRequests from "../../components/friendRequests/FriendRequests";
import FriendList from "../../components/friendList/FriendList";
import { styled } from "@mui/material/styles";
import { usePostContext } from "../../hooks/usePostContext";

const StyledCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const FileInputContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "10px",
});

const FileInput = styled("input")({
  display: "block",
  marginBottom: "5px",
});

const UploadButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#6a0b3f",
  color: "white",
  borderRadius: "5px",
  padding: theme.spacing(1, 2),
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "#9c1111",
    transform: "scale(1.05)",
  },
}));

const Profile = () => {
  const { posts, dispatch: postDispatch } = usePostContext();
  const { user, dispatch: userDispatch } = useAuthContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const [showReqs, setShowReqs] = useState(false);
  const [showFriends, setShowFriends] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const response = await fetch(`/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        postDispatch({ type: "SET_POSTS", payload: json });
      } else {
        console.log(json.error);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user, postDispatch]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePfp = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("pfp", selectedFile);

    const response = await fetch(`/api/users/${user._id}/profile-pic`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    const json = await response.json();

    if (response.ok) {
      userDispatch({ type: "UPDATE_PFP", payload: json });
      setShowFileInput(false);
    } else {
      console.error(json.message);
    }
  };

  return (
    <Box sx={{ display: "flex", padding: 2 }}>
      <Grid container spacing={2}>
        {/* New Post Form */}
        <Grid item xs={6} md={4} sx={{ position: "sticky", top: 10 }}>
          <NewPostForm />
        </Grid>

        {/* Profile Header */}
        <Grid item xs={6} md={8} sx={{ position: "sticky", top: 10 }}>
          <StyledCard>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Avatar src={user.profilePic} sx={{ width: 140, height: 140 }} />
              <IconButton
                onClick={() => setShowFileInput(!showFileInput)}
                sx={{
                  bottom: 0,
                  right: 0,
                  borderRadius: "50%",
                }}
              >
                <AddCircleOutlineRoundedIcon />
              </IconButton>
              {showFileInput && (
                <FileInputContainer>
                  <FileInput type="file" onChange={handleFileChange} />
                  <UploadButton onClick={handlePfp}>Upload</UploadButton>
                </FileInputContainer>
              )}
              <Box sx={{ marginLeft: 2 }}>
                <h1>{user.username}</h1>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <span>{posts ? posts.length : 0} Posts</span>
                  <span
                    onClick={() => setShowFriends(!showFriends)}
                    style={{ cursor: "pointer" }}
                  >
                    {user.friends?.length || 0} Friends
                  </span>
                  <span
                    onClick={() => setShowReqs(!showReqs)}
                    style={{ cursor: "pointer" }}
                  >
                    {user.friendRequests?.length || 0} Requests
                  </span>
                </Box>
              </Box>
            </Box>
          </StyledCard>
        </Grid>

        {/* Friend Requests */}
        {showReqs && (
          <Grid item xs={6} md={4}>
            <StyledCard>
              {user.friendRequests?.map((req) => (
                <FriendRequests key={req._id} />
              ))}
            </StyledCard>
          </Grid>
        )}

        {/* Friends List */}
        {showFriends && (
          <Grid item xs={6} md={4}>
            <StyledCard>
              <FriendList />
            </StyledCard>
          </Grid>
        )}
        {!showFriends && !showReqs && <Grid item xs={6} md={4}></Grid>}

        {/* Posts Container */}
        <Grid
          item
          xs={6}
          md={8}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            position: "sticky",
            top: "200px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              overflowY: "auto",
              maxHeight: "calc(100vh - 10px)",
            }}
          >
            {posts && posts.map((post) => <Posts key={post._id} post={post} />)}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
