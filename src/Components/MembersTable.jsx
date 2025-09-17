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
  { id: 1, name: "George Lindelof", phone: "+1 345 22 62", email: "carlsen@nakshi.no", status: "Active" },
  { id: 2, name: "Eric Dyer", phone: "+1 345 22 65", email: "ericbyer.nakshi@gmail.com", status: "Active" },
  { id: 3, name: "Haitam Alassani", phone: "+1 345 22 21", email: "haitam@gmail.com", status: "Active" },
  { id: 4, name: "Michael Campbell", phone: "+1 756 52 73", email: "campb@hotmail.com", status: "Inactive" },
  { id: 5, name: "Ashley Williams", phone: "+1 965 41 11", email: "william.a@nakshi.com", status: "Active" },
  { id: 6, name: "Vanessa Parodi", phone: "+1 544 12 38", email: "parodi.v@google.com", status: "Active" },
  { id: 7, name: "Lora Palmer", phone: "+1 909 34 33", email: "lora.palm@gmail.com", status: "Active" },
  { id: 8, name: "Christy Newborn", phone: "+1 254 79 12", email: "chris@nakshi.com", status: "Inactive" },
  { id: 9, name: "Nick Jackel", phone: "+1 608 43 12", email: "jackel12@google.com", status: "Active" },
  { id: 10, name: "Tora Laundersen", phone: "+1 343 62 33", email: "tora.lau@nakshi.com", status: "Active" },
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
          <h2 className="members-title">Members</h2>
          <Button variant="contained" startIcon={<PersonAddIcon />} size="small">Add new</Button>
          <Button variant="outlined" size="small">Import</Button>
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
