import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Button, Tooltip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FilterListIcon from "@mui/icons-material/FilterList";

const API_URL = "https://nakshi.onrender.com/api/products"; // your backend URL

export default function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    mainPhoto: null,
    photos: [null, null, null],
    gender: "",
    categoryType: "",
    occasion: "",
  });
  const [errors, setErrors] = useState({});

  // ✅ Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "mainPhoto") {
        setForm((f) => ({ ...f, mainPhoto: files[0] }));
      } else {
        const index = parseInt(name.split("_")[1], 10);
        const newPhotos = [...form.photos];
        newPhotos[index] = files[0];
        setForm((f) => ({ ...f, photos: newPhotos }));
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function validateForm() {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";

    if (!form.price || isNaN(form.price)) {
      newErrors.price = "Price must be a number";
    } else if (parseFloat(form.price) < 1000) {
      newErrors.price = "Price must be at least 1000";
    }

    if (!form.quantity || isNaN(form.quantity)) {
      newErrors.quantity = "Quantity must be a number";
    } else if (parseInt(form.quantity, 10) < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.categoryType) newErrors.categoryType = "Category is required";
    if (!form.occasion) newErrors.occasion = "Occasion is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ✅ Submit Add/Edit Product
  async function handleSubmit() {
    if (!validateForm()) return;

    try {
      // using FormData to handle images
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "photos") {
          value.forEach((file, i) => {
            if (file) formData.append(`photos`, file);
          });
        } else {
          formData.append(key, value);
        }
      });

      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchProducts(); // refresh
      handleClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  }

  // ✅ Delete
  async function removeProduct(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  // ✅ Open edit form
  function openEditForm(product) {
    setForm({
      ...product,
      photos: product.photos || [null, null, null],
    });
    setEditId(product._id);
    setOpen(true);
  }

  function handleClose() {
    setForm({
      name: "",
      description: "",
      price: "",
      quantity: "",
      mainPhoto: null,
      photos: [null, null, null],
      gender: "",
      categoryType: "",
      occasion: "",
    });
    setErrors({});
    setEditId(null);
    setOpen(false);
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      String(p.price).includes(query)
  );

  return (
    <section className="products-card">
      {/* Header */}
      <div className="products-header d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <h2 className="products-title">Products</h2>
          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            size="small"
            onClick={() => setOpen(true)}
          >
            Add new
          </Button>
        </div>
        <div className="d-flex align-items-center">
          <input
            className="search-input"
            placeholder="Search by name, description or price..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Tooltip title="Filter">
            <IconButton sx={{ ml: "1rem" }}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editId ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Product Name" name="name" value={form.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} required />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} error={!!errors.description} helperText={errors.description} multiline rows={3} required />
          <TextField label="Price" name="price" value={form.price} onChange={handleChange} error={!!errors.price} helperText={errors.price} required />
          <TextField label="Quantity" name="quantity" value={form.quantity} onChange={handleChange} error={!!errors.quantity} helperText={errors.quantity} required />
          <TextField select label="Gender" name="gender" value={form.gender} onChange={handleChange} error={!!errors.gender} helperText={errors.gender} required>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="unisex">Unisex</MenuItem>
          </TextField>
          <TextField select label="Category" name="categoryType" value={form.categoryType} onChange={handleChange} error={!!errors.categoryType} helperText={errors.categoryType} required>
            {["rings","chains","earrings","necklace","bangles","bracelet","mangalsutra","kada","watches"].map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
          <TextField select label="Occasion" name="occasion" value={form.occasion} onChange={handleChange} error={!!errors.occasion} helperText={errors.occasion} required>
            <MenuItem value="everyday">Everyday</MenuItem>
            <MenuItem value="bridal">Bridal</MenuItem>
            <MenuItem value="festive">Festive</MenuItem>
          </TextField>

          {/* Image Upload */}
          <div>
            <label>Main Photo *</label>
            <input type="file" name="mainPhoto" accept="image/*" onChange={handleChange} />
          </div>
          <div>
            <label>Other Photos (3)</label>
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <input type="file" name={`photo_${i}`} accept="image/*" onChange={handleChange} />
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Update Product" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      <TableContainer component={Paper} className="products-table-wrap">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Main Photo</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Occasion</TableCell>
              <TableCell align="right">Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p._id}>
                <TableCell>
                  {p.mainPhoto ? <Avatar src={p.mainPhoto} /> : "-"}
                </TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.description}</TableCell>
                <TableCell>₹{p.price}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell>{p.gender}</TableCell>
                <TableCell>{p.categoryType}</TableCell>
                <TableCell>{p.occasion}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => openEditForm(p)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => removeProduct(p._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">No products found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}
