import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Tooltip,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FilterListIcon from "@mui/icons-material/FilterList";

const initialProducts = [
  {
    id: 1,
    name: "Gold Chain",
    description: "1gm gold plated snake chain",
    price: "₹1200",
    quantity: 25,
    status: "Active",
  },
  {
    id: 2,
    name: "Silver Ring",
    description: "Sterling silver oxidized ring",
    price: "₹800",
    quantity: 50,
    status: "Inactive",
  },
];

function StatusChip({ status }) {
  return (
    <Chip
      label={status}
      color={status === "Active" ? "success" : "default"}
      size="small"
    />
  );
}

export default function ProductsTable() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.price.includes(query)
  );

  function toggleStatus(id) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" }
          : p
      )
    );
  }

  function removeProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <section className="products-card">
      <div className="products-header d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <h2 className="products-title">Products</h2>
          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            size="small"
          >
            Add new
          </Button>
          <Button variant="outlined" size="small">
            Export (Excel)
          </Button>
        </div>

        <div className="d-flex align-items-center">
          <div className="search-wrapper d-flex align-items-center">
            <input
              className="search-input"
              placeholder="Search by name, description or price..."
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

      <TableContainer component={Paper} className="products-table-wrap">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Operation</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="col-avatar">
                  <Avatar>{p.name[0]}</Avatar>
                </TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.description}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.quantity}</TableCell>

                <TableCell>
                  <div className="d-flex align-items-center gap-2">
                    <StatusChip status={p.status} />
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => toggleStatus(p.id)}
                    >
                      Toggle
                    </Button>
                  </div>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="View">
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => removeProduct(p.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}
