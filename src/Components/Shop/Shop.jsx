// src/components/Shop.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import heroImage from "../../assets/shopimg2.jpg";
import axios from "axios";
import "../../CSS/Shop/Shop.css";
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
import CheckIcon from "@mui/icons-material/Check";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";

export default function Shop() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(""); // 'filter' or 'sort'
  const [genderFilter, setGenderFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRange, setPriceRange] = useState([1000, 1000000]);
  const [sortOrder, setSortOrder] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [tempGenderFilter, setTempGenderFilter] = useState(genderFilter);
  const [tempTypeFilter, setTempTypeFilter] = useState(typeFilter);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const [tempSortOrder, setTempSortOrder] = useState(sortOrder);
  const productsPerPage = 48;

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://nakshi.onrender.com/api/products");
        setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
        console.log("Fetched products:", res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // 🛒 Add to cart handlers
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
    const totalItems = Object.values(newQuantities).reduce((sum, q) => sum + q, 0);
    setCartCount(totalItems);
    setShowCartPopup(totalItems > 0);
  };

  // 🧭 Pagination
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // 🧩 Filtering logic
  let filteredProducts = Array.isArray(products)
    ? products.filter((p) => {
        let genderMatch = genderFilter ? p.gender.toLowerCase() === genderFilter.toLowerCase() : true;
        let typeMatch = typeFilter ? p.category.toLowerCase() === typeFilter.toLowerCase() : true;
        let priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
        let quickFilterMatch = filter
          ? filter === "Women" || filter === "Men"
            ? p.gender === filter
            : ["Ring", "Earring", "Necklace"].includes(filter)
            ? p.category === filter
            : true
          : true;
        return genderMatch && typeMatch && priceMatch && quickFilterMatch;
      })
    : [];

  // ⚙️ Sorting
  if (sortOrder === "lowToHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "highToLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // 🧾 Pagination logic
  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // 🎨 Button active style
  const getButtonStyle = (btnFilter) => ({
    backgroundColor: filter === btnFilter ? "#a60019" : "transparent",
    color: filter === btnFilter ? "#fff" : "inherit",
    borderColor: "#a60019",
    "&:hover": {
      backgroundColor: filter === btnFilter ? "#8b0015" : "rgba(166, 0, 25, 0.1)",
    },
  });

  // ------------------ BREADCRUMB LOGIC ------------------
  // derive friendly names from path segments
  const pathSegments = location.pathname.split("/").filter(Boolean); // e.g. ['shop','gold']
  const friendly = (seg) => {
    if (!seg) return "Home";
    // map common slugs to display names
    const map = {
      shop: "Shop",
      gold: "Gold",
      rings: "Rings",
      earrings: "Earrings",
      necklace: "Necklace",
      collections: "Collections",
      account: "Account",
    };
    return map[seg.toLowerCase()] || seg.charAt(0).toUpperCase() + seg.slice(1);
  };

  // if a quick filter is active, show it as the last crumb
  const breadcrumbCrumbs = [{ label: "Home", to: "/" }];
  if (pathSegments.length > 0) {
    breadcrumbCrumbs.push({
      label: friendly(pathSegments[0]),
      to: `/${pathSegments[0]}`,
    });
    if (pathSegments.length > 1) {
      breadcrumbCrumbs.push({
        label: friendly(pathSegments[1]),
        to: `/${pathSegments.slice(0, 2).join("/")}`,
      });
    }
  } else {
    // when at / or empty path, show Shop if on this page
    breadcrumbCrumbs.push({ label: "Shop", to: "/shop" });
  }

  // if user clicked a quick filter (e.g., "Gold" or "Women") use that as active crumb
  if (filter) {
    // avoid duplicate
    const last = breadcrumbCrumbs[breadcrumbCrumbs.length - 1]?.label;
    if (last !== filter) {
      breadcrumbCrumbs.push({ label: filter, to: `/shop?filter=${encodeURIComponent(filter)}` });
    }
  } else if (typeFilter) {
    const last = breadcrumbCrumbs[breadcrumbCrumbs.length - 1]?.label;
    if (last !== typeFilter) {
      breadcrumbCrumbs.push({ label: typeFilter, to: `/shop?type=${encodeURIComponent(typeFilter)}` });
    }
  }

  // ------------------ RENDER ------------------
  return (
    <section className="shop-section">
      {/* ===== Breadcrumb (new) ===== */}
      <div className="shop-breadcrumb-wrap">
        <nav className="shop-breadcrumb" aria-label="breadcrumb">
          {breadcrumbCrumbs.map((c, idx) => {
            const isLast = idx === breadcrumbCrumbs.length - 1;
            return (
              <span key={idx} className={`crumb ${isLast ? "active" : ""}`}>
                {!isLast ? (
                  <Link to={c.to} onClick={() => navigate(c.to)} className="crumb-link">
                    {c.label}
                  </Link>
                ) : (
                  <span className="crumb-current">{c.label}</span>
                )}
                {!isLast && <span className="crumb-sep">›</span>}
              </span>
            );
          })}
        </nav>
      </div>

      {/* Filter Buttons */}
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
          onClick={() => {
            setFilter("Women");
            setPage(1);
          }}
          sx={{
            ...getButtonStyle("Women"),
            "@media (max-width: 768px)": { display: "none" },
          }}
        >
          Women
        </Button>
        <Button
          variant="outlined"
          startIcon={<ManIcon />}
          onClick={() => {
            setFilter("Men");
            setPage(1);
          }}
          sx={{
            ...getButtonStyle("Men"),
            "@media (max-width: 766px)": { display: "none" },
          }}
        >
          Men
        </Button>
        <Button
          variant="outlined"
          startIcon={<RingVolumeIcon />}
          onClick={() => {
            setFilter("Ring");
            setPage(1);
          }}
          sx={{
            ...getButtonStyle("Ring"),
            "@media (max-width: 766px)": { display: "none" },
          }}
        >
          Rings
        </Button>
        <Button
          variant="outlined"
          startIcon={<EarbudsIcon />}
          onClick={() => {
            setFilter("Earring");
            setPage(1);
          }}
          sx={{
            ...getButtonStyle("Earring"),
            "@media (max-width: 768px)": { display: "none" },
          }}
        >
          Earrings
        </Button>
        <Button
          variant="outlined"
          startIcon={<DiamondIcon />}
          onClick={() => {
            setFilter("Necklace");
            setPage(1);
          }}
          sx={{
            ...getButtonStyle("Necklace"),
            "@media (max-width: 768px)": { display: "none" },
          }}
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
            setPriceRange([1000, 1000000]);
            setSortOrder("");
            setPage(1);
          }}
          sx={{
            "@media (max-width: 766px)": { display: "none" },
          }}
        >
          Clear Filters
        </Button>
      </Stack>

      {/* Drawer for filter/sort */}
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
              <FormControl fullWidth sx={{ mt: 2 }}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup value={tempGenderFilter} onChange={(e) => setTempGenderFilter(e.target.value)}>
                  <FormControlLabel value="Female" control={<Radio />} label="Women" />
                  <FormControlLabel value="Male" control={<Radio />} label="Men" />
                  <FormControlLabel value="Unisex" control={<Radio />} label="Unisex" />
                </RadioGroup>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <FormLabel>Product Type</FormLabel>
                <RadioGroup value={tempTypeFilter} onChange={(e) => setTempTypeFilter(e.target.value)}>
                  {[
                    "Rings",
                    "Chains",
                    "Earrings",
                    "Necklace",
                    "Bangles",
                    "Bracelet",
                    "Mangalsutra",
                    "Kada",
                    "Watches",
                  ].map((cat) => (
                    <FormControlLabel key={cat} value={cat} control={<Radio />} label={cat} />
                  ))}
                </RadioGroup>
              </FormControl>

              <Typography gutterBottom>
                Price Range: ₹{tempPriceRange[0]} - ₹{tempPriceRange[1]}
              </Typography>
              <Slider
                value={tempPriceRange}
                onChange={(_, newValue) => setTempPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={1000}
                max={1000000}
                step={500}
              />

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => {
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
                  setTempPriceRange([1000, 1000000]);
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
                <RadioGroup value={tempSortOrder} onChange={(e) => setTempSortOrder(e.target.value)}>
                  <FormControlLabel value="lowToHigh" control={<Radio />} label="Price: Low to High" />
                  <FormControlLabel value="highToLow" control={<Radio />} label="Price: High to Low" />
                </RadioGroup>
              </FormControl>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => {
                  setSortOrder(tempSortOrder);
                  setDrawerOpen(false);
                }}
              >
                Apply Sorting
              </Button>
            </>
          )}
        </div>
      </Drawer>

      {/* Product grid */}
      <div className="gridflex">
        <div className="shop-grid">
          {paginatedProducts.length === 0 ? (
            <Typography align="center" sx={{ mt: 5 }}>
              No products found.
            </Typography>
          ) : (
            paginatedProducts.map((item) => {
              const qty = quantities[item._id] || 0;
              return (
                <div
                  className="shop-card"
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Link to={`/product/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="img">
                      <img src={item.mainPhoto} alt={item.name} className="shop-img" />
                    </div>
                    <h3 className="shop-name">{item.name}</h3>
                    <p className="shop-price">₹{item.price.toLocaleString()}</p>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
