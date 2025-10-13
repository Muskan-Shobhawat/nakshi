import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FilterListIcon from "@mui/icons-material/FilterList";

const initialMembers = [
  { id: 1, name: "Muskan Shobhawat", phone: "+91 9876543210", email: "muskan@nakshi.no", status: "Active" },
  { id: 2, name: "Rohit K", phone: "+91 9876543210", email: "rohite@nakshi.no", status: "Active" },
];

function StatusChip({ status }) {
  const color = status === "Active" ? "success" : "default";
  return <Chip label={status} color={status === "Active" ? "success" : "default"} size="small" />;
}

export default function MembersTable() {
  const [members, setMembers] = useState(initialMembers);
  const [query, setQuery] = useState("");

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase()) ||
      m.phone.includes(query)
  );

  function toggleStatus(id) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" } : m)));
  }

  function removeMember(id) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <section className="members-card">
      <div className="members-header d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <h2 className="members-title">Users</h2>
          {/* <Button variant="contained" startIcon={<PersonAddIcon />} size="small">Add new</Button> */}
          {/* <Button variant="outlined" size="small">Import</Button> */}
          <Button variant="outlined" size="small">Export (Excel)</Button>
        </div>

        <div className="d-flex align-items-center">
          <div className="search-wrapper d-flex align-items-center">
            <input
              className="search-input"
              placeholder="Search by name, email or phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Tooltip title="Filter">
            <IconButton sx={{ ml: "1rem" }}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <TableContainer component={Paper} className="members-table-wrap">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Member name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Operation</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="col-avatar">
                  <Avatar>{m.name.split(" ").map(n => n[0]).slice(0,2).join("")}</Avatar>
                </TableCell>

                <TableCell>{m.name}</TableCell>
                <TableCell>{m.phone}</TableCell>
                <TableCell>{m.email}</TableCell>

                <TableCell>
                  <div className="d-flex align-items-center gap-2">
                    <StatusChip status={m.status} />
                    <Button variant="text" size="small" onClick={() => toggleStatus(m.id)}>
                      Toggle
                    </Button>
                  </div>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="View">
                    <IconButton><VisibilityIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton color="primary"><EditIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => removeMember(m.id)}><DeleteIcon /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}
