import React from "react";
import { IconButton, Avatar, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function Topbar() {
  return (
    <header className="topbar d-flex align-items-center">
      <div className="topbar-left d-flex align-items-center">
        <InputBase
          placeholder="Search members..."
          className="topbar-search"
          startAdornment={<SearchIcon fontSize="small" />}
        />
      </div>

      <div className="topbar-right d-flex align-items-center">
        <div className="topbar-stats">
          <div className="small-muted">Total</div>
          <div className="strong">2,000</div>
        </div>

        <div className="profile-wrap d-flex align-items-center">
          <div className="profile-info">
            <div className="small-muted">Admin</div>
            <div className="strong">Luke Asofe</div>
          </div>
          <IconButton size="large">
            <Avatar>LA</Avatar>
          </IconButton>
        </div>
      </div>
    </header>
  );
}
