import { useCallback, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  Drawer,
  Divider,
  List,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import MoreIcon from '@mui/icons-material/MoreVert';
import ListItemLink from "./context/ListItemLink";
import { useAuth } from "./context/AuthContext";

const drawerWidth = 240;

export default function Layout() {
  const auth = useAuth();
  const navigate = useNavigate();
  const token = auth.token();

  const [menuAnchor, setMenuAnchor] = useState(null); // TODO: Switch to useReducer()
  const menuOpen = Boolean(menuAnchor);
  const openMenu = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const logout = useCallback(async () => {
    closeMenu();
    try {
      await auth.signout();
    } catch (e) { } // eslint-disable-line no-empty
  }, [auth]);

  const toProfile = useCallback(() => {
    closeMenu();
    navigate("/profile");
  }, [navigate]);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
            }}
          >
            Audio Host
          </Typography>
          <IconButton
            id="user-menu-button"
            aria-controls={menuOpen ? "user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
            onClick={openMenu}
          >
            <MoreIcon />
          </IconButton>
          <Menu
            id="user-menu"
            aria-labelledby="user-menu-button"
            anchorEl={menuAnchor}
            open={menuOpen}
            onClose={closeMenu}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={toProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={logout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItemLink to="/" primary="Home" icon={<HomeIcon />} />
          {token ? <ListItemLink to="/upload" primary="Upload" icon={<InventoryIcon />} /> : null}
          <ListItemLink to="/profile" primary="Profile" icon={<PersonIcon />} />
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}


