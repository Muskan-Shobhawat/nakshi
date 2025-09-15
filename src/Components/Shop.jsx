// src/components/Shop.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../CSS/Shop.css";
import {
  Button,
  Stack,
  Typography,
  Pagination,
  Drawer,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Slider,
  Divider,
  Paper,
  Slide,
  IconButton,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import WomanIcon from "@mui/icons-material/Woman";
import ManIcon from "@mui/icons-material/Man";
import DiamondIcon from "@mui/icons-material/Diamond";
import RingVolumeIcon from "@mui/icons-material/RingVolume";
import EarbudsIcon from "@mui/icons-material/Earbuds";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import CheckIcon from "@mui/icons-material/Check"; // ✅ MUI icon
import heroImage from "../assets/heroimg.jpg";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";

// Sample Products
const products = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.floor(Math.random() * (1000000 - 5000) + 5000), // random price
  image: `${heroImage}`,
  description:
    "Elegant 1gm gold-plated bangle perfect for weddings and festive occasions.",
  gender: i % 2 === 0 ? "Women" : "Men",
  occasion: i % 3 === 0 ? "Wedding" : "Casual",
  type:
    i % 4 === 0
      ? "Ring"
      : i % 4 === 1
      ? "Earring"
      : i % 4 === 2
      ? "Necklace"
      : "Bangle",
}));

export default function Shop() {
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState({});
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(""); // 'filter' or 'sort'
  const [genderFilter, setGenderFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRange, setPriceRange] = useState([5000, 1000000]);
  const [sortOrder, setSortOrder] = useState("");

  // For cart popup
  const [cartCount, setCartCount] = useState(0);
  const [showCartPopup, setShowCartPopup] = useState(false);

  const [tempGenderFilter, setTempGenderFilter] = useState(genderFilter);
  const [tempTypeFilter, setTempTypeFilter] = useState(typeFilter);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const [tempSortOrder, setTempSortOrder] = useState(sortOrder);

  const productsPerPage = 48;

  // Quantity Change Handlers
  const handleAddToCart = (id) => {
    setQuantities((prev) => {
      const newQuantities = { ...prev, [id]: 1 };
      updateCartCount(newQuantities);
      return newQuantities;
    });
  };

  const increaseQty = (id) => {
    setQuantities((prev) => {
      const newQuantities = { ...prev, [id]: (prev[id] || 0) + 1 };
      updateCartCount(newQuantities);
      return newQuantities;
    });
  };

  const decreaseQty = (id) => {
    setQuantities((prev) => {
      let newQty = (prev[id] || 0) - 1;
      if (newQty < 0) newQty = 0;
      const newQuantities = { ...prev, [id]: newQty };
      updateCartCount(newQuantities);
      return newQuantities;
    });
  };

  const updateCartCount = (newQuantities) => {
    const totalItems = Object.values(newQuantities).reduce(
      (sum, q) => sum + q,
      0
    );
    setCartCount(totalItems);
    setShowCartPopup(totalItems > 0);
  };

  // Pagination Change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Combined Filtering
  let filteredProducts = products.filter((p) => {
    let genderMatch = genderFilter
      ? p.gender.toLowerCase() === genderFilter.toLowerCase()
      : true;
    let typeMatch = typeFilter
      ? p.type.toLowerCase() === typeFilter.toLowerCase()
      : true;
    let priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
    let quickFilterMatch = filter
      ? filter === "Women" || filter === "Men"
        ? p.gender === filter
        : ["Ring", "Earring", "Necklace"].includes(filter)
        ? p.type === filter
        : true
      : true;
    return genderMatch && typeMatch && priceMatch && quickFilterMatch;
  });

  // Sorting
  if (sortOrder === "lowToHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "highToLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Pagination Logic
  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Active Filter Button Style
  const getButtonStyle = (btnFilter) => ({
    backgroundColor: filter === btnFilter ? "#a60019" : "transparent",
    color: filter === btnFilter ? "#fff" : "inherit",
    borderColor: "#a60019",
    "&:hover": {
      backgroundColor:
        filter === btnFilter ? "#8b0015" : "rgba(166, 0, 25, 0.1)",
    },
  });

  return (
    <section className="shop-section">
      {/* Hero Section */}
      <div className="shop-hero">
        <h1 className="shop-hero-title">Bridal & Everyday Collections</h1>
        <p className="shop-hero-tagline">
          Golden touch to your everyday — Explore our timeless 1gm gold-plated
          jewelry.
        </p>
      </div>

      {/* Filter Bar */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ flexWrap: "wrap", padding: "1rem" }}
      >
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => {
            setDrawerType("filter");
            setDrawerOpen(true);
          }}
        >
          Filter
        </Button>
        <Button
          variant="outlined"
          startIcon={<SortIcon />}
          onClick={() => {
            setDrawerType("sort");
            setDrawerOpen(true);
          }}
        >
          Sort
        </Button>
        <Button
          variant="outlined"
          startIcon={<WomanIcon />}
          onClick={() => setFilter("Women")}
          sx={getButtonStyle("Women")}
        >
          Women
        </Button>
        <Button
          variant="outlined"
          startIcon={<ManIcon />}
          onClick={() => setFilter("Men")}
          sx={getButtonStyle("Men")}
        >
          Men
        </Button>
        <Button
          variant="outlined"
          startIcon={<RingVolumeIcon />}
          onClick={() => setFilter("Ring")}
          sx={getButtonStyle("Ring")}
        >
          Rings
        </Button>
        <Button
          variant="outlined"
          startIcon={<EarbudsIcon />}
          onClick={() => setFilter("Earring")}
          sx={getButtonStyle("Earring")}
        >
          Earrings
        </Button>
        <Button
          variant="outlined"
          startIcon={<DiamondIcon />}
          onClick={() => setFilter("Necklace")}
          sx={getButtonStyle("Necklace")}
        >
          Necklace
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<ClearAllIcon />}
          onClick={() => {
            setFilter(null);
            setGenderFilter("");
            setTypeFilter("");
            setPriceRange([5000, 1000000]);
            setSortOrder("");
            setPage(1);
          }}
        >
          Clear Filters
        </Button>
      </Stack>

      {/* Drawer for Filter/Sort */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ width: 300, zIndex: 10000 }}
      >
        <div style={{ width: 300, padding: "1rem" }}>
          {drawerType === "filter" && (
            <>
              <Typography variant="h6">Filter By</Typography>
              <Divider sx={{ my: 1 }} />

              {/* Gender Filter */}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  value={tempGenderFilter}
                  onChange={(e) => setTempGenderFilter(e.target.value)}
                >
                  <FormControlLabel
                    value="Women"
                    control={<Radio />}
                    label="Women"
                  />
                  <FormControlLabel
                    value="Men"
                    control={<Radio />}
                    label="Men"
                  />
                  <FormControlLabel
                    value="Unisex"
                    control={<Radio />}
                    label="Unisex"
                  />
                </RadioGroup>
              </FormControl>

              {/* Product Type */}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <FormLabel>Product Type</FormLabel>
                <RadioGroup
                  value={tempTypeFilter}
                  onChange={(e) => setTempTypeFilter(e.target.value)}
                >
                  <FormControlLabel
                    value="Necklace"
                    control={<Radio />}
                    label="Necklace"
                  />
                  <FormControlLabel
                    value="Chain"
                    control={<Radio />}
                    label="Chains"
                  />
                  <FormControlLabel
                    value="Earring"
                    control={<Radio />}
                    label="Earrings"
                  />
                  <FormControlLabel
                    value="Bangle"
                    control={<Radio />}
                    label="Bangles"
                  />
                  <FormControlLabel
                    value="Bracelet"
                    control={<Radio />}
                    label="Bracelets"
                  />
                  <FormControlLabel
                    value="Ring"
                    control={<Radio />}
                    label="Rings"
                  />
                </RadioGroup>
              </FormControl>

              {/* Price Range */}
              <Typography gutterBottom>
                Price Range: ₹{tempPriceRange[0]} - ₹{tempPriceRange[1]}
              </Typography>
              <Slider
                value={tempPriceRange}
                onChange={(_, newValue) => setTempPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={5000}
                max={1000000}
                step={50}
              />

              {/* Buttons */}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => {
                  // Apply filters
                  setGenderFilter(tempGenderFilter);
                  setTypeFilter(tempTypeFilter);
                  setPriceRange(tempPriceRange);
                  setDrawerOpen(false);
                }}
              >
                Apply Filters
              </Button>

              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => {
                  setTempGenderFilter("");
                  setTempTypeFilter("");
                  setTempPriceRange([5000, 1000000]);
                }}
              >
                Clear Filters
              </Button>
            </>
          )}

          {drawerType === "sort" && (
            <>
              <Typography variant="h6">Sort By</Typography>
              <Divider sx={{ my: 1 }} />

              <FormControl>
                <RadioGroup
                  value={tempSortOrder}
                  onChange={(e) => setTempSortOrder(e.target.value)}
                >
                  <FormControlLabel
                    value="lowToHigh"
                    control={<Radio />}
                    label="Price: Low to High"
                  />
                  <FormControlLabel
                    value="highToLow"
                    control={<Radio />}
                    label="Price: High to Low"
                  />
                </RadioGroup>
              </FormControl>

              {/* Buttons */}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => {
                  setSortOrder(tempSortOrder);
                  setDrawerOpen(false);
                }}
              >
                Apply Sorting
              </Button>

              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setTempSortOrder("")}
              >
                Clear Sorting
              </Button>
            </>
          )}
        </div>
      </Drawer>

      {/* Products Grid */}
      <div className="shop-grid">
        {paginatedProducts.map((item) => {
          const qty = quantities[item.id] || 0;
          return (
            <div className="shop-card" key={item.id}>
              {/* Link wraps only product display, not cart buttons */}
              <Link
                to={`/product/${item.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img src={item.image} alt={item.name} className="shop-img" />
                <h3 className="shop-name">{item.name}</h3>
                <p className="shop-price">₹{item.price.toLocaleString()}</p>
                <p className="shop-description">{item.description}</p>
                <div className="shop-details">
                  <Typography variant="body2">
                    <strong>Gender:</strong> {item.gender}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Occasion:</strong> {item.occasion}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Type:</strong> {item.type}
                  </Typography>
                </div>
              </Link>

              {/* Cart Buttons */}
              {qty === 0 ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => handleAddToCart(item.id)}
                >
                  Add to Cart
                </Button>
              ) : (
                <div className="added-section" style={{ marginTop: "0.5rem" }}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    disabled
                    sx={{ mb: 1 }}
                  >
                    Added <CheckIcon sx={{ ml: 1 }} />
                  </Button>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button
                      variant="outlined"
                      onClick={() => decreaseQty(item.id)}
                    >
                      -
                    </Button>
                    <Typography variant="body1">{qty}</Typography>
                    <Button
                      variant="outlined"
                      onClick={() => increaseQty(item.id)}
                    >
                      +
                    </Button>
                  </Stack>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredProducts.length / productsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>

      {/* Cart Popup */}
      <Slide direction="up" in={showCartPopup} mountOnEnter unmountOnExit>
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#a60019",
            color: "white",
            borderRadius: "12px 12px 0 0",
            zIndex: 1300,
          }}
        >
          <Typography variant="body1">{cartCount} item(s) added</Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: "white", color: "#a60019" }}
            onClick={() => navigate("/cart")}
          >
            View Cart
          </Button>
        </Paper>
      </Slide>

      <Box
        sx={{
          mt: 6,
          py: 6,
          backgroundImage: `
      linear-gradient(135deg, #ffe4ec, #ffd6e8, #fff0f6),
      repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 2px, transparent 2px, transparent 6px)
    `,
          backgroundBlendMode: "overlay",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: "bold", mb: 4, color: "#d81b60" }}
        >
          Why Choose Nakshi?
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {/* Gold Plated Jewellery */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: "20px",
                boxShadow: 3,
                backgroundColor: "#ffe4ec",
              }}
            >
              <DiamondIcon sx={{ fontSize: 50, color: "#d81b60" }} />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Gold Plated Jewellery
                </Typography>
                <Typography variant="body2">
                  Crafted with premium gold plating for lasting shine.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Easy Exchanges */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: "20px",
                boxShadow: 3,
                backgroundColor: "#ffe4ec",
              }}
            >
              <AutorenewIcon sx={{ fontSize: 50, color: "#d81b60" }} />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Easy Exchanges
                </Typography>
                <Typography variant="body2">
                  Hassle-free returns and exchanges at your convenience.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Free Shipping */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: "20px",
                boxShadow: 3,
                backgroundColor: "#ffe4ec",
              }}
            >
              <LocalShippingIcon sx={{ fontSize: 50, color: "#d81b60" }} />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Free Shipping
                </Typography>
                <Typography variant="body2">
                  Enjoy complimentary delivery on all orders.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Secure Payments */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: "20px",
                boxShadow: 3,
                backgroundColor: "#ffe4ec",
              }}
            >
              <LockIcon sx={{ fontSize: 50, color: "#d81b60" }} />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Secure Payments
                </Typography>
                <Typography variant="body2">
                  Trusted and safe payment options for peace of mind.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Exclusive Designs */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: "20px",
                boxShadow: 3,
                backgroundColor: "#ffe4ec",
              }}
            >
              <StarIcon sx={{ fontSize: 50, color: "#d81b60" }} />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Exclusive Designs
                </Typography>
                <Typography variant="body2">
                  Unique handcrafted jewellery you won’t find elsewhere.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </section>
  );
}
