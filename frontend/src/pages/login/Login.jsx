import React, { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { Container, TextField, Button, Link, Box, Alert } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, loading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
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
      }}
    >
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
        <h1>Login</h1>

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
          Login
        </Button>

        {error && (
          <Alert severity="error" sx={{ marginTop: "16px" }}>
            {error}
          </Alert>
        )}

        <Box sx={{ marginTop: "16px", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link
            href="/signup"
            sx={{
              textDecoration: "none",
              color: "#6a0b3f",
              fontWeight: "bold",
            }}
          >
            Sign Up
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
