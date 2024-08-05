import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <AppBar position="static" sx={{ background: "#fff", color: "#333" }}>
      <Toolbar
        className="container"
        sx={{
          margin: "0 auto",
          padding: "0 ",
          display: "flex",
        }}
      >
        <Box sx={{ flex: "1" }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h1>TetherNet</h1>
          </Link>
        </Box>

        <Box sx={{ display: "flex" }}>
          {user ? (
            <>
              <IconButton
                onClick={handleMenuClick}
                sx={{ padding: 0, marginLeft: "10px" }}
              >
                <Avatar alt={user.username} src={user.profilePic} />
                <Typography sx={{ margin: "4px" }}>{user.username}</Typography>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Link
                  to={"/settings"}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MenuItem>Settings</MenuItem>
                </Link>
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Typography
                component={Link}
                to="/login"
                sx={{
                  textDecoration: "none",
                  color: "#333",
                  marginLeft: "10px",
                }}
              >
                Login
              </Typography>
              <Typography
                component={Link}
                to="/signup"
                sx={{
                  textDecoration: "none",
                  color: "#333",
                  marginLeft: "10px",
                }}
              >
                Signup
              </Typography>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
