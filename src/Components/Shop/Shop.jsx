// src/components/Shop.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../../CSS/Shop/Shop.css";
import {
  Button,
  Stack,
  Typography,
  Drawer,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Slider,
  Divider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import WomanIcon from "@mui/icons-material/Woman";
import ManIcon from "@mui/icons-material/Man";
import DiamondIcon from "@mui/icons-material/Diamond";
import RingVolumeIcon from "@mui/icons-material/RingVolume";
import EarbudsIcon from "@mui/icons-material/Earbuds";
import ClearAllIcon from "@mui/icons-material/ClearAll";

export default function Shop() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(""); // 'filter' or 'sort'
  const [genderFilter, setGenderFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRange, setPriceRange] = useState([1000, 1000000]);
  const [sortOrder, setSortOrder] = useState("");
  const [tempGenderFilter, setTempGenderFilter] = useState(genderFilter);
  const [tempTypeFilter, setTempTypeFilter] = useState(typeFilter);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const [tempSortOrder, setTempSortOrder] = useState(sortOrder);
  const productsPerPage = 48;

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://nakshi.onrender.com/api/products");
        setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // simple filtering / sorting logic
  let filteredProducts = Array.isArray(products)
    ? products.filter((p) => {
        let genderMatch = genderFilter ? (p.gender || "").toLowerCase() === genderFilter.toLowerCase() : true;
        let typeMatch = typeFilter ? (p.category || "").toLowerCase() === typeFilter.toLowerCase() : true;
        let priceMatch = (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1];
        let quickFilterMatch = filter
          ? filter === "Women" || filter === "Men"
            ? (p.gender || "") === filter
            : ["Ring", "Earring", "Necklace"].includes(filter)
            ? (p.category || "") === filter
            : true
          : true;
        return genderMatch && typeMatch && priceMatch && quickFilterMatch;
      })
    : [];

  if (sortOrder === "lowToHigh") filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sortOrder === "highToLow") filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));

  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const getButtonStyle = (btnFilter) => ({
    backgroundColor: filter === btnFilter ? "#a60019" : "transparent",
    color: filter === btnFilter ? "#fff" : "inherit",
    borderColor: "#a60019",
    "&:hover": { backgroundColor: filter === btnFilter ? "#8b0015" : "rgba(166,0,25,0.08)" },
  });

  // breadcrumb/title/result count
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const friendly = (seg) => {
    if (!seg) return "Home";
    const map = {
      shop: "All Jewellery",
      gold: "Gold",
      rings: "Rings",
      earrings: "Earrings",
      necklace: "Necklace",
      collections: "Collections",
      account: "Account",
    };
    return map[seg.toLowerCase()] || seg.charAt(0).toUpperCase() + seg.slice(1);
  };

  const breadcrumbCrumbs = [{ label: "Home", to: "/" }];
  if (pathSegments.length > 0) {
    breadcrumbCrumbs.push({ label: friendly(pathSegments[0]), to: `/${pathSegments[0]}` });
    if (pathSegments.length > 1) breadcrumbCrumbs.push({ label: friendly(pathSegments[1]), to: `/${pathSegments.slice(0,2).join("/")}` });
  } else breadcrumbCrumbs.push({ label: "Shop", to: "/shop" });

  if (filter) {
    const last = breadcrumbCrumbs[breadcrumbCrumbs.length - 1]?.label;
    if (last !== filter) breadcrumbCrumbs.push({ label: filter, to: `/shop?filter=${encodeURIComponent(filter)}` });
  } else if (typeFilter) {
    const last = breadcrumbCrumbs[breadcrumbCrumbs.length - 1]?.label;
    if (last !== typeFilter) breadcrumbCrumbs.push({ label: typeFilter, to: `/shop?type=${encodeURIComponent(typeFilter)}` });
  }

  const pageTitle = filter || (pathSegments.length > 0 ? friendly(pathSegments[0]) : "All Jewellery");
  const resultCount = (filteredProducts || []).length;
  const formattedCount = resultCount.toLocaleString();

  // determine second image robustly
  const getSecondImage = (item) => {
    return (
      item?.photos?.[1] ||
      (item?.gallery && item.gallery[1]) ||
      item?.secondaryPhoto ||
      item?.altPhoto ||
      item?.mainPhoto ||
      ""
    );
  };

  return (
    <section className="shop-section">
      {/* breadcrumb */}
      <div className="shop-breadcrumb-wrap">
        <nav className="shop-breadcrumb" aria-label="breadcrumb">
          {breadcrumbCrumbs.map((c, idx) => {
            const isLast = idx === breadcrumbCrumbs.length - 1;
            return (
              <span key={idx} className={`crumb ${isLast ? "active" : ""}`}>
                {!isLast ? (
                  <Link to={c.to} onClick={() => navigate(c.to)} className="crumb-link">{c.label}</Link>
                ) : (
                  <span className="crumb-current">{c.label}</span>
                )}
                {!isLast && <span className="crumb-sep">›</span>}
              </span>
            );
          })}
        </nav>
      </div>

      {/* results title */}
      <div className="shop-results-wrap">
        <div className="shop-results-inner">
          <h1 className="shop-results-title">{pageTitle}</h1>
          <span className="shop-results-count">({formattedCount} results)</span>
        </div>
      </div>

      {/* filters - unchanged layout */}
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ flexWrap: "wrap", padding: "1rem" }}>
        <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => { setDrawerType("filter"); setDrawerOpen(true); }}>Filter</Button>
        <Button variant="outlined" startIcon={<SortIcon />} onClick={() => { setDrawerType("sort"); setDrawerOpen(true); }}>Sort</Button>

        <Button variant="outlined" startIcon={<WomanIcon />} onClick={() => { setFilter("Women"); setPage(1); }} sx={{ ...getButtonStyle("Women"), "@media (max-width: 768px)": { display: "none" } }}>Women</Button>

        <Button variant="outlined" startIcon={<ManIcon />} onClick={() => { setFilter("Men"); setPage(1); }} sx={{ ...getButtonStyle("Men"), "@media (max-width: 766px)": { display: "none" } }}>Men</Button>

        <Button variant="outlined" startIcon={<RingVolumeIcon />} onClick={() => { setFilter("Ring"); setPage(1); }} sx={{ ...getButtonStyle("Ring"), "@media (max-width: 766px)": { display: "none" } }}>Rings</Button>

        <Button variant="outlined" startIcon={<EarbudsIcon />} onClick={() => { setFilter("Earring"); setPage(1); }} sx={{ ...getButtonStyle("Earring"), "@media (max-width: 768px)": { display: "none" } }}>Earrings</Button>

        <Button variant="outlined" startIcon={<DiamondIcon />} onClick={() => { setFilter("Necklace"); setPage(1); }} sx={{ ...getButtonStyle("Necklace"), "@media (max-width: 768px)": { display: "none" } }}>Necklace</Button>

        <Button variant="contained" color="error" startIcon={<ClearAllIcon />} onClick={() => { setFilter(null); setGenderFilter(""); setTypeFilter(""); setPriceRange([1000, 1000000]); setSortOrder(""); setPage(1); }} sx={{ "@media (max-width: 766px)": { display: "none" } }}>Clear Filters</Button>
      </Stack>

      {/* Drawer for filter/sort (unchanged) */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ width: 300, zIndex: 10000 }}>
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
                  {["Rings", "Chains", "Earrings", "Necklace", "Bangles", "Bracelet", "Mangalsutra", "Kada", "Watches"].map((cat) => (
                    <FormControlLabel key={cat} value={cat} control={<Radio />} label={cat} />
                  ))}
                </RadioGroup>
              </FormControl>

              <Typography gutterBottom>Price Range: ₹{tempPriceRange[0]} - ₹{tempPriceRange[1]}</Typography>
              <Slider value={tempPriceRange} onChange={(_, newValue) => setTempPriceRange(newValue)} valueLabelDisplay="auto" min={1000} max={1000000} step={500} />

              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => { setGenderFilter(tempGenderFilter); setTypeFilter(tempTypeFilter); setPriceRange(tempPriceRange); setDrawerOpen(false); }}>Apply Filters</Button>

              <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }} onClick={() => { setTempGenderFilter(""); setTempTypeFilter(""); setTempPriceRange([1000, 1000000]); }}>Clear Filters</Button>
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

              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => { setSortOrder(tempSortOrder); setDrawerOpen(false); }}>Apply Sorting</Button>
            </>
          )}
        </div>
      </Drawer>

      {/* Product grid */}
      <div className="gridflex">
        <div className="shop-grid">
          {paginatedProducts.length === 0 ? (
            <Typography align="center" sx={{ mt: 5 }}>No products found.</Typography>
          ) : (
            paginatedProducts.map((item) => {
              const secondImg = getSecondImage(item);
              // check if product is low stock (simulate)
              const isLow = item?.stock === 1 || item?.onlyOne;
              return (
                <div className="shop-card" key={item._id || item.id}>
                  <Link to={`/product/${item._id || item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="img">
                      {(item.badge || item.isExpert) && <div className="card-badge">{item.badge || "EXPERT'S CHOICE"}</div>}
                      <div className="card-heart">♡</div>

                      {/* primary + secondary images stacked for slide/fade */}
                      <img className="shop-img primary" src={item.mainPhoto || item.image || ""} alt={item.name} />
                      <img className="shop-img secondary" src={secondImg} alt={`${item.name} alt`} />

                      <div className="img-tooltip">{item.name}</div>
                    </div>

                    {/* Title & price block (matches your reference) */}
                    <h3 className="shop-name">{item.name}</h3>
                    <p className="shop-price">
                      <span className="rupee">₹</span>
                      <span className="price-val">{(item.price || 0).toLocaleString()}</span>
                      {isLow && <span className="only-one">Only 1 left!</span>}
                    </p>
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
