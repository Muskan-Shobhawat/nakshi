import React from "react";
import { Avatar, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <Avatar sx={{ bgcolor: "#fff", color: "#6c2fb7" }}>N</Avatar>
          <div className="brand-text">
            <div className="brand-title">Nakshi</div>
            <div className="brand-sub">Admin</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <List>
          <ListItem button className="nav-item active">
            <ListItemIcon className="nav-icon"><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button className="nav-item">
            <ListItemIcon className="nav-icon"><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>

          <ListItem button className="nav-item">
            <ListItemIcon className="nav-icon"><WorkOutlineIcon /></ListItemIcon>
            <ListItemText primary="Projects" />
          </ListItem>

          <ListItem button className="nav-item">
            <ListItemIcon className="nav-icon"><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="Tasks" />
          </ListItem>

          <ListItem button className="nav-item">
            <ListItemIcon className="nav-icon"><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </nav>

      <footer className="sidebar-footer">
        <small>© Nakshi</small>
      </footer>
    </aside>
  );
}
