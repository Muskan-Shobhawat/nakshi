import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
// import MembersTable from "./MembersTable";
import "../CSS/Admin.css";

export default function AdminPanel() {
  return (
    <>
      <Sidebar />
      <Topbar />

      <main className="main">
        <div className="content-inner">
          <Outlet />
        </div>
      </main>
    </>
  );
}
