import React, { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import { Container, TextField, Button, Link, Box, Alert } from "@mui/material";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { signup, loading, error } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, username, password);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f0f0f0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          filter: "blur(8px)",
          zIndex: -1,
        }}
      />

      <h1>TetherNet</h1>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1>Signup</h1>

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
          sx={{
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              "& fieldset": {
                borderColor: "#6a0b3f",
              },
              "&:hover fieldset": {
                borderColor: "#6a0b3f",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6a0b3f",
              },
            },
          }}
        />
        <TextField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          required
          sx={{
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              "& fieldset": {
                borderColor: "#6a0b3f",
              },
              "&:hover fieldset": {
                borderColor: "#6a0b3f",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6a0b3f",
              },
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          sx={{
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              "& fieldset": {
                borderColor: "#6a0b3f",
              },
              "&:hover fieldset": {
                borderColor: "#6a0b3f",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6a0b3f",
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            marginTop: "16px",
            backgroundColor: "#6a0b3f",
            borderRadius: "20px",
            "&:hover": {
              backgroundColor: "#6a0b3f",
            },
          }}
        >
          Signup
        </Button>

        {error && (
          <Alert severity="error" sx={{ marginTop: "16px" }}>
            {error}
          </Alert>
        )}

        <Box sx={{ marginTop: "16px", textAlign: "center" }}>
          Have an account?{" "}
          <Link
            href="/login"
            sx={{
              textDecoration: "none",
              color: "#6a0b3f",
              fontWeight: "bold",
            }}
          >
            Log in
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
