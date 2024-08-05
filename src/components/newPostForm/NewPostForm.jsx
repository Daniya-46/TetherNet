import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { usePostContext } from "../../hooks/usePostContext";
import { TextField, Button, Input } from "@mui/material";

const NewPostForm = () => {
  const { dispatch } = usePostContext();
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const handlePost = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You're not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("media", media);
    formData.append("author", user._id);

    try {
      const response = await fetch("/posts", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        setCaption("");
        setMedia(null);
        document.getElementById("media-input").value = "";

        dispatch({ type: "CREATE_POST", payload: json });
      } else {
        console.error("Failed to create post:", json);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={handlePost}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        maxWidth: "500px",
        margin: "auto",
      }}
    >
      <h1>Add New Post</h1>

      <TextField
        label="Caption"
        value={caption}
        placeholder="What's on your mind..."
        onChange={(e) => setCaption(e.target.value)}
        fullWidth
        sx={{
          borderRadius: "20px",
          backgroundColor: "#bababa",
          "& .MuiInputLabel-root": {
            color: "#fff",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            "&.Mui-focused fieldset": {
              borderColor: "#6a0b3f",
            },
          },
        }}
      />

      <label
        style={{
          marginTop: "16px",
          fontSize: "16px",
          color: "black",
        }}
      >
        Media:
        <Input
          id="media-input"
          type="file"
          accept="image/*, video/*"
          onChange={(e) => setMedia(e.target.files[0])}
          sx={{
            marginTop: "10px",
            backgroundColor: "bababa",
            "& .MuiInputLabel-root": {
              color: "#fff",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              "&.Mui-focused fieldset": {
                borderColor: "#6a0b3f",
              },
            },
          }}
        />
      </label>

      <Button
        type="submit"
        variant="contained"
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          backgroundColor: "#6a0b3f",
          "&:hover": {
            backgroundColor: "#6a0b3f",
          },
        }}
      >
        Post
      </Button>

      {error && (
        <div className="error" style={{ color: "red" }}>
          {error}
        </div>
      )}
    </form>
  );
};

export default NewPostForm;
