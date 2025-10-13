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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase/Firebase.js";

const API_URL = "https://nakshi.onrender.com/api/products";

export default function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    mainPhoto: null,
    photo1: null,
    photo2: null,
    photo3: null,
    gender: "",
    category: "",
    occasion: "",
  });
  const [errors, setErrors] = useState({});

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
      setForm((f) => ({ ...f, [name]: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function validateForm() {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.price || isNaN(form.price)) newErrors.price = "Price must be a number";
    else if (parseFloat(form.price) < 1000) newErrors.price = "Price must be at least 1000";
    if (!form.quantity || isNaN(form.quantity)) newErrors.quantity = "Quantity must be a number";
    else if (parseInt(form.quantity, 10) < 1) newErrors.quantity = "Quantity must be at least 1";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.occasion) newErrors.occasion = "Occasion is required";
    if (!form.mainPhoto) newErrors.mainPhoto = "Main photo is required";
    if (!form.photo1 || !form.photo2 || !form.photo3) newErrors.photos = "All 3 additional photos are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function uploadImageToFirebase(file, folder) {
    return new Promise((resolve, reject) => {
      const fileName = `${folder}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    setUploading(true);

    try {
      // Upload all photos to Firebase
      const mainPhotoURL = await uploadImageToFirebase(form.mainPhoto, "jewellery");
      const photo1URL = await uploadImageToFirebase(form.photo1, "jewellery");
      const photo2URL = await uploadImageToFirebase(form.photo2, "jewellery");
      const photo3URL = await uploadImageToFirebase(form.photo3, "jewellery");

      const payload = {
        name: form.name,
        description: form.description,
        price: form.price,
        quantity: form.quantity,
        gender: form.gender,
        category: form.category,
        occasion: form.occasion,
        mainPhoto: mainPhotoURL,
        photos: [photo1URL, photo2URL, photo3URL],
      };

      if (editId) {
        await axios.put(`${API_URL}/${editId}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }

      fetchProducts();
      handleClose();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setUploading(false);
    }
  }

  async function removeProduct(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  function openEditForm(product) {
    setForm({
      ...product,
      mainPhoto: null,
      photo1: null,
      photo2: null,
      photo3: null,
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
      photo1: null,
      photo2: null,
      photo3: null,
      gender: "",
      category: "",
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
      <div className="products-header d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <h2 className="products-title">Products</h2>
          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            size="small"
            onClick={() => setOpen(true)}
            disabled={uploading}
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
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Unisex">Unisex</MenuItem>
          </TextField>

          <TextField select label="Category" name="category" value={form.category} onChange={handleChange} error={!!errors.category} helperText={errors.category} required>
            {["Rings","Chains","Earrings","Necklace","Bangles","Bracelet","Mangalsutra","Kada","Watches"].map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>

          <TextField select label="Occasion" name="occasion" value={form.occasion} onChange={handleChange} error={!!errors.occasion} helperText={errors.occasion} required>
            <MenuItem value="Everyday">Everyday</MenuItem>
            <MenuItem value="Bridal">Bridal</MenuItem>
            <MenuItem value="Festive">Festive</MenuItem>
          </TextField>

          <div>
            <label>Main Photo *</label>
            <input type="file" name="mainPhoto" accept="image/*" onChange={handleChange} />
            {errors.mainPhoto && <p style={{ color: "red" }}>{errors.mainPhoto}</p>}
          </div>

          <div>
            <label>Other Photos (photo1, photo2, photo3)</label>
            <input type="file" name="photo1" accept="image/*" onChange={handleChange} />
            <input type="file" name="photo2" accept="image/*" onChange={handleChange} />
            <input type="file" name="photo3" accept="image/*" onChange={handleChange} />
            {errors.photos && <p style={{ color: "red" }}>{errors.photos}</p>}
          </div>

          {uploading && <p style={{ color: "blue" }}>Uploading images to Firebase...</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={uploading}>
            {uploading ? "Uploading..." : editId ? "Update Product" : "Add Product"}
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
                <TableCell>{p.mainPhoto ? <Avatar src={p.mainPhoto} /> : "-"}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.description}</TableCell>
                <TableCell>₹{p.price}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell>{p.gender}</TableCell>
                <TableCell>{p.category}</TableCell>
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
