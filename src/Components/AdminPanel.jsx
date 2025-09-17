import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MembersTable from "./MembersTable";

export default function AdminPanel() {
  return (
    <>
      <Sidebar />
      <Topbar />
      <main className="main">
        <div className="content-inner">
          <MembersTable />
        </div>
      </main>
    </>
  );
}
