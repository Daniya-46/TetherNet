import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      setPrivacy(user.isPrivate || false);
    }
  }, [user]);

  const handlePrivacyChange = async (event) => {
    const newPrivacy = event.target.checked;
    setPrivacy(newPrivacy);

    try {
      const response = await fetch(`/user/${user._id}/privacy-settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ isPrivate: newPrivacy }),
      });

      if (!response.ok) {
        throw new Error("Failed to update privacy settings");
      }

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating privacy settings:", error);
    }
  };

  const handleNotificationsChange = (event) => {
    setNotifications(event.target.checked);
  };

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
        padding: "20px",
      }}
    >
      <Card
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Settings
          </Typography>
          <Box sx={{ marginBottom: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={handleNotificationsChange}
                  color="primary"
                />
              }
              label="Notifications"
              sx={{ justifyContent: "center" }}
            />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={privacy}
                  onChange={handlePrivacyChange}
                  color="primary"
                />
              }
              label="Privacy Settings"
              sx={{ justifyContent: "center" }}
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={handleNotificationsChange}
                  color="primary"
                />
              }
              label="Theme"
              sx={{ justifyContent: "center" }}
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Settings;
