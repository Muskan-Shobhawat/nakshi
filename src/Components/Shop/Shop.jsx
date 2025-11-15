// src/components/Shop.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, useLocation, useParams } from "react-router-dom";
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
  const params = useParams();

  const [products, setProducts] = useState([]);
  const [serverTotal, setServerTotal] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRange, setPriceRange] = useState([1000, 1000000]);
  const [sortOrder, setSortOrder] = useState("");
  const [tempGenderFilter, setTempGenderFilter] = useState("");
  const [tempTypeFilter, setTempTypeFilter] = useState("");
  const [tempPriceRange, setTempPriceRange] = useState([1000, 1000000]);
  const [tempSortOrder, setTempSortOrder] = useState("");
  const productsPerPage = 48;

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const qCategory = query.get("category");
  const qOccasion = query.get("occasion");
  const qGender = query.get("gender");
  // routeCategory: supports either /shop/category/:category OR specific paths /shop/earrings /shop/rings
  let routeCategory = params?.category || null;
  const path = location.pathname || "";

  // support direct routes like /shop/earrings and /shop/rings (per your Option A)
  if (!routeCategory) {
    if (path.startsWith("/shop/earrings")) routeCategory = "Earrings";
    if (path.startsWith("/shop/rings")) routeCategory = "Rings";
    // If you use /shop/new we will detect new arrivals below
  }

  const isNewArrivalsRoute =
    path === "/shop/new" || path.startsWith("/shop/new");

  // backend base normalization
  const RAW_API_BASE =
    import.meta.env.VITE_APP_BACKEND_URI || "https://nakshi.onrender.com";
  const API_BASE = RAW_API_BASE.replace(/\/+$/, "");
  const PRODUCTS_ENDPOINT = API_BASE.endsWith("/api")
    ? `${API_BASE}/products`
    : `${API_BASE}/api/products`;

  // fetch products (server-side query where possible)
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        const qs = [];

        if (isNewArrivalsRoute) qs.push("new=true");

        // routeCategory (from /shop/earrings, /shop/rings or /shop/category/:category)
        const categoryForQuery = routeCategory || qCategory || typeFilter || "";
        if (categoryForQuery)
          qs.push(`category=${encodeURIComponent(categoryForQuery)}`);

        // occasion/gender from URL query (priority)
        if (qOccasion) qs.push(`occasion=${encodeURIComponent(qOccasion)}`);
        if (qGender) qs.push(`gender=${encodeURIComponent(qGender)}`);

        // drawer filters (if applied)
        if (genderFilter) qs.push(`gender=${encodeURIComponent(genderFilter)}`);
        if (typeFilter && !categoryForQuery)
          qs.push(`category=${encodeURIComponent(typeFilter)}`);

        // price & sort
        if (
          priceRange &&
          (priceRange[0] !== 1000 || priceRange[1] !== 1000000)
        ) {
          qs.push(`priceMin=${encodeURIComponent(priceRange[0])}`);
          qs.push(`priceMax=${encodeURIComponent(priceRange[1])}`);
        }
        if (sortOrder) qs.push(`sort=${encodeURIComponent(sortOrder)}`);

        // pagination (request a chunk)
        const limit = productsPerPage * 4;
        qs.push(`limit=${limit}`);
        qs.push(`skip=${(page - 1) * productsPerPage}`);

        const queryStr = qs.length ? `?${qs.join("&")}` : "";
        const url = `${PRODUCTS_ENDPOINT}${queryStr}`;

        const res = await axios.get(url);
        if (!mounted) return;

        // accept different server shapes
        if (
          res.data &&
          typeof res.data === "object" &&
          Array.isArray(res.data.products)
        ) {
          setProducts(res.data.products || []);
          setServerTotal(
            typeof res.data.total === "number" ? res.data.total : null
          );
        } else if (Array.isArray(res.data)) {
          setProducts(res.data || []);
          setServerTotal(null);
        } else {
          setProducts(res.data.products || []);
          setServerTotal(res.data.total || null);
        }
      } catch (err) {
        console.error("fetch products error", err);
      }
    };

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, [
    routeCategory,
    qCategory,
    qOccasion,
    qGender,
    location.pathname,
    genderFilter,
    typeFilter,
    priceRange,
    sortOrder,
    page,
    PRODUCTS_ENDPOINT,
    isNewArrivalsRoute,
  ]);

  // client-side filtering fallback
  const filteredProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    let out = list.filter((p) => {
      // handle query-supplied gender from URL or drawer
      const urlGender = qGender || genderFilter;
      const compareGender = (val) => {
        if (!val) return true;
        const a = (p.gender || "").toLowerCase();
        return (
          a === val.toLowerCase() ||
          a ===
            (val === "Women"
              ? "female"
              : val === "Men"
              ? "male"
              : val.toLowerCase())
        );
      };

      // handle url category / route category / drawer type
      const catFilter = routeCategory || qCategory || typeFilter || filter;
      const compareCategory = (val) => {
        if (!val) return true;
        const pc = (p.category || "").toLowerCase();
        return (
          pc.includes(val.toLowerCase()) ||
          (val.toLowerCase() === "all" && true)
        );
      };

      const priceMatch =
        (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1];

      // occasion match: qOccasion or any drawer occasion stored in typeFilter (if used)
      const occFilter = qOccasion || null;
      const compareOcc = (val) => {
        if (!val) return true;
        const occ = (p.occasion || "").toLowerCase();
        return occ.includes(val.toLowerCase()) || occ === val.toLowerCase();
      };

      return (
        compareGender(urlGender) &&
        compareCategory(catFilter) &&
        priceMatch &&
        compareOcc(occFilter)
      );
    });

    if (sortOrder === "lowToHigh")
      out.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortOrder === "highToLow")
      out.sort((a, b) => (b.price || 0) - (a.price || 0));

    return out;
  }, [
    products,
    qGender,
    genderFilter,
    routeCategory,
    qCategory,
    typeFilter,
    filter,
    priceRange,
    qOccasion,
    sortOrder,
  ]);

  // pagination
  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // counts
  const resultCount =
    serverTotal !== null ? serverTotal : filteredProducts.length;
  const formattedCount = resultCount.toLocaleString();

  // helpers
  const getButtonStyle = (btnFilter) => ({
    backgroundColor: filter === btnFilter ? "#a60019" : "transparent",
    color: filter === btnFilter ? "#fff" : "inherit",
    borderColor: "#a60019",
    "&:hover": {
      backgroundColor: filter === btnFilter ? "#8b0015" : "rgba(166,0,25,0.08)",
    },
  });

  const friendly = (seg) => {
    if (!seg) return "Home";
    const map = {
      shop: "All Jewellery",
      rings: "Rings",
      earrings: "Earrings",
      necklace: "Necklace",
      collections: "Collections",
      account: "Account",
    };
    return map[seg.toLowerCase()] || seg.charAt(0).toUpperCase() + seg.slice(1);
  };

  // breadcrumb build
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbCrumbs = [{ label: "Home", to: "/" }];
  if (pathSegments.length > 0) {
    breadcrumbCrumbs.push({
      label: friendly(pathSegments[0]),
      to: `/${pathSegments[0]}`,
    });
    if (pathSegments.length > 1)
      breadcrumbCrumbs.push({
        label: friendly(pathSegments[1]),
        to: `/${pathSegments.slice(0, 2).join("/")}`,
      });
  } else breadcrumbCrumbs.push({ label: "Shop", to: "/shop" });

  // show query/category in breadcrumb if present
  if (qCategory)
    breadcrumbCrumbs.push({
      label: qCategory,
      to: location.pathname + location.search,
    });
  else if (routeCategory)
    breadcrumbCrumbs.push({ label: routeCategory, to: location.pathname });
  else if (qOccasion)
    breadcrumbCrumbs.push({
      label: qOccasion,
      to: location.pathname + location.search,
    });
  else if (qGender)
    breadcrumbCrumbs.push({
      label: qGender,
      to: location.pathname + location.search,
    });
  else if (isNewArrivalsRoute)
    breadcrumbCrumbs.push({ label: "New Arrivals", to: location.pathname });

  // page title
  const pageTitle = isNewArrivalsRoute
    ? "New Arrivals"
    : routeCategory || qCategory
    ? routeCategory || qCategory
    : qGender || filter
    ? qGender || filter
    : "All Jewellery";

  const getSecondImage = (item) => {
    if (item?.photos?.[1]) return item.photos[1];
    if (item?.photos?.[0]) return item.photos[0];
    return item.mainPhoto || "";
  };

  // drawer handlers
  const applyFiltersFromDrawer = () => {
    setGenderFilter(tempGenderFilter);
    setTypeFilter(tempTypeFilter);
    setPriceRange(tempPriceRange);
    setSortOrder(tempSortOrder);
    setDrawerOpen(false);
    setPage(1);
  };

  const clearDrawerFilters = () => {
    setTempGenderFilter("");
    setTempTypeFilter("");
    setTempPriceRange([1000, 1000000]);
    setTempSortOrder("");
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
                  <Link
                    to={c.to}
                    onClick={() => navigate(c.to)}
                    className="crumb-link"
                  >
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

      {/* results title + count */}
      <div className="shop-results-wrap">
        <div className="shop-results-inner">
          <h1 className="shop-results-title">{pageTitle}</h1>
          <span className="shop-results-count">({formattedCount} results)</span>
        </div>
      </div>

      {/* filter buttons */}
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
            navigate("/shop?gender=Female");
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
            navigate("/shop?gender=Male");
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
            navigate("/shop/rings");
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
            navigate("/shop/earrings");
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
            navigate("/shop?category=Necklace");
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
            navigate("/shop");
          }}
          sx={{ "@media (max-width: 766px)": { display: "none" } }}
        >
          Clear Filters
        </Button>
      </Stack>

      {/* drawer (filter / sort) */}
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
                <RadioGroup
                  value={tempGenderFilter}
                  onChange={(e) => setTempGenderFilter(e.target.value)}
                >
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Women"
                  />
                  <FormControlLabel
                    value="Male"
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

              <FormControl fullWidth sx={{ mt: 2 }}>
                <FormLabel>Product Type</FormLabel>
                <RadioGroup
                  value={tempTypeFilter}
                  onChange={(e) => setTempTypeFilter(e.target.value)}
                >
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
                    <FormControlLabel
                      key={cat}
                      value={cat}
                      control={<Radio />}
                      label={cat}
                    />
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
                onClick={applyFiltersFromDrawer}
              >
                Apply Filters
              </Button>

              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => clearDrawerFilters()}
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

      {/* product grid */}
      <div className="gridflex">
        <div className="shop-grid">
          {paginatedProducts.length === 0 ? (
            <Typography align="center" sx={{ mt: 5 }}>
              No products found.
            </Typography>
          ) : (
            paginatedProducts.map((item) => {
              const secondImg = getSecondImage(item);
              const isLow = item?.stock === 1 || item?.onlyOne;
              return (
                <div className="shop-card" key={item._id || item.id}>
                  <Link
                    to={`/product/${item._id || item.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="img">
                      {(item.badge || item.isExpert) && (
                        <div className="card-badge">
                          {item.badge || "EXPERT'S CHOICE"}
                        </div>
                      )}
                      <div className="card-heart">♡</div>
                      <img
                        className="shop-img primary"
                        src={item.mainPhoto || item.image || ""}
                        alt={item.name}
                      />
                      <img
                        className="shop-img secondary"
                        src={secondImg}
                        alt={`${item.name} alt`}
                      />
                      <div className="img-tooltip">{item.name}</div>
                    </div>

                    <h3 className="shop-name">{item.name}</h3>
                    <p className="shop-price">
                      <span className="rupee">₹</span>
                      <span className="price-val">
                        {(item.price || 0).toLocaleString()}
                      </span>
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
