// src/components/NavbarNakshi.jsx
import React, { useState, useEffect, useRef } from "react";
import "../CSS/nav.css"; // keep your path
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import call from "../assets/call.png";
import location from "../assets/location.png";
import fb from "../assets/fb.png";
import insta from "../assets/insta.png";
import { useNavigate } from "react-router-dom";

function NavbarNakshi() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [activeMega, setActiveMega] = useState(null); // 'all' | 'earrings' | 'rings' | null
  const [mobilePanel, setMobilePanel] = useState(null); // 'all' | 'earrings' | 'rings' | 'profile' | null

  const API = import.meta.env.VITE_APP_BACKEND_URI;
  const API_BASE = API?.replace(/\/+$/, "") || ""; // normalize base (no trailing slash)
  const navigate = useNavigate();

  // ref to detect outside clicks for desktop mega menu
  const navRef = useRef(null);

  // ---- Auth check (unchanged except using API_BASE) ----
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_BASE}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          return;
        }
        const data = await res.json();
        if (data?.success && data?.user) {
          setIsLoggedIn(true);
          setUserName(data.user.name || "");
        }
      } catch {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    };
    verifyToken();
  }, [API_BASE]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/login");
  };

  // ---- Close mega on outside click or Esc ----
  useEffect(() => {
    const handleDocClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMega(null);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setActiveMega(null);
    };
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("touchstart", handleDocClick, { passive: true });
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("touchstart", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // --------- DATA ----------
  const menus = {
    all: {
      title: "All Jewellery",
      columns: [
        {
          head: "Category",
          items: [
            "All Jewellery",
            "Earrings",
            "Rings",
            "Mangalsutra",
            "Necklace Sets",
            "Bracelets",
            "Chains",
          ],
        },
        {
          head: "Occasion",
          items: ["Everyday", "Casual", "Festive"],
        },
        { head: "Gender", items: ["Female", "Male"] },
      ],
    },
    earrings: {
      title: "Earrings",
      columns: [
        { head: "Category", items: ["All Earrings", "Studs & Tops", "Jhumkas"] },
        { head: "Occasion", items: ["Everyday", "Casual", "Festive"] },
      ],
    },
    rings: {
      title: "Rings",
      columns: [
        { head: "Category", items: ["All Rings", "Casual Rings", "Traditional Rings"] },
        { head: "Occasion", items: ["Everyday", "Casual", "Festive"] },
        { head: "Gender", items: ["Female", "Male"] },
      ],
    },
  };

  // minimal category slug map to ensure exact backend slug (use exact case expected by backend)
  const categorySlugMap = {
    earrings: "Earrings",
    rings: "Rings",
    necklaces: "Necklaces",
    "necklace sets": "NecklaceSets",
    necklace: "Necklace",
    chains: "Chains",
    mangalsutra: "Mangalsutra",
    bracelets: "Bracelets",
    bangles: "Bangles",
    watches: "Watches",
    kada: "Kada",
  };

  // ---------- navigation helper ----------
  // maps clicked menu text -> route or query and closes menus
  const goToFromMega = (item) => {
    const raw = String(item || "").trim();
    if (!raw) {
      navigate("/shop");
      setActiveMega(null);
      return;
    }
    const lower = raw.toLowerCase();

    // direct "all" route
    if (lower.includes("all jewellery") || lower === "all jewellery" || lower === "all") {
      navigate("/shop");
      setActiveMega(null);
      return;
    }

    // check category mapping keys for exact slug mapping (ensures "Rings" slug not "rings")
    const mapKeys = Object.keys(categorySlugMap);
    const foundKey = mapKeys.find((k) => lower === k || lower.includes(k));
    if (foundKey) {
      const slug = categorySlugMap[foundKey];
      navigate(`/shop/category/${encodeURIComponent(slug)}`);
      setActiveMega(null);
      return;
    }

    // occasions (use lowercase comparison)
    const occasions = ["everyday", "casual", "festive", "traditional", "modern wear", "office wear"];
    if (occasions.includes(lower)) {
      navigate(`/shop?occasion=${encodeURIComponent(raw)}`);
      setActiveMega(null);
      return;
    }

    // ----- Gender: normalized mapping (case-insensitive) -----
    // Accepts "female"/"male" as well as "women"/"men" from different places in UI.
    const genderMap = {
      female: "Female",
      women: "Female",
      male: "Male",
      men: "Male",
    };
    if (genderMap[lower]) {
      // navigate with canonical gender value that backend expects
      navigate(`/shop?gender=${encodeURIComponent(genderMap[lower])}`);
      setActiveMega(null);
      return;
    }

    // Earrings subcategories (e.g., "studs & tops", "jhumkas") - map to earrings category with subquery
    const earringsSub = ["studs & tops", "jhumkas", "all earrings"];
    if (earringsSub.includes(lower)) {
      const earringsSlug = categorySlugMap["earrings"] || "Earrings";
      navigate(`/shop/category/${encodeURIComponent(earringsSlug)}?subcategory=${encodeURIComponent(raw)}`);
      setActiveMega(null);
      return;
    }

    // Rings subcategories
    const ringsSub = ["all rings", "casual rings", "traditional rings"];
    if (ringsSub.includes(lower)) {
      const ringsSlug = categorySlugMap["rings"] || "Rings";
      navigate(`/shop/category/${encodeURIComponent(ringsSlug)}?subcategory=${encodeURIComponent(raw)}`);
      setActiveMega(null);
      return;
    }

    // fallback to shop root
    navigate("/shop");
    setActiveMega(null);
  };

  // Desktop Mega Menu (uses buttons so we can call navigate & close menu)
  const MegaMenu = ({ type }) => {
    const data = menus[type];
    if (!data) return null;

    return (
      <div
        className={`mega-wrap ${activeMega === type ? "show" : ""}`}
        onMouseEnter={() => setActiveMega(type)}
        onMouseLeave={() => setActiveMega(null)}
      >
        <div className="mega-inner">
          {data.columns.map((col, idx) => (
            <div className="mega-col" key={idx}>
              <div className="mega-head">{col.head}</div>
              <div className="mega-grid">
                {col.items.map((it, i) => (
                  <button
                    key={i}
                    className="mega-chip"
                    type="button"
                    onClick={() => goToFromMega(it)}
                  >
                    {it}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Mobile MV-style Panel (use buttons to navigate + close mobile menu)
  const MobilePanel = ({ type }) => {
    if (type === "profile") {
      return (
        <div className="mv-panel">
          <div className="mv-head">
            <button className="mv-back" onClick={() => setMobilePanel(null)}>&larr;</button>
            <span className="mv-title">{userName ? userName.split(" ")[0] : "Profile"}</span>
            <button className="mv-close" onClick={() => setMenuOpen(false)}>×</button>
          </div>
          <div className="mv-body">
            <div className="mv-block">
              <div className="mv-chip-wrap">
                <button
                  className="mv-chip"
                  onClick={() => {
                    navigate("/account");
                    setMenuOpen(false);
                    setMobilePanel(null);
                  }}
                >
                  My Account
                </button>
                <button
                  className="mv-chip"
                  onClick={() => {
                    navigate("/cart");
                    setMenuOpen(false);
                    setMobilePanel(null);
                  }}
                >
                  My Cart
                </button>
                <button
                  className="mv-chip"
                  onClick={() => {
                    navigate("/orders");
                    setMenuOpen(false);
                    setMobilePanel(null);
                  }}
                >
                  My Orders
                </button>
                <button
                  className="mv-chip mv-danger"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                    setMobilePanel(null);
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const data = menus[type];
    if (!data) return null;

    return (
      <div className="mv-panel">
        <div className="mv-head">
          <button className="mv-back" onClick={() => setMobilePanel(null)}>&larr;</button>
          <span className="mv-title">{data.title}</span>
          <button className="mv-close" onClick={() => setMenuOpen(false)}>×</button>
        </div>
        <div className="mv-body">
          {data.columns.map((col, idx) => (
            <div className="mv-block" key={idx}>
              <div className="mv-block-head">{col.head}</div>
              <div className="mv-chip-wrap">
                {col.items.map((it, i) => (
                  <button
                    key={i}
                    className="mv-chip"
                    onClick={() => {
                      // navigate & close
                      goToFromMega(it);
                      setMenuOpen(false);
                      setMobilePanel(null);
                    }}
                    type="button"
                  >
                    {it}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Click togglers for desktop links (keeps your toggle behavior)
  const toggleMega = (key) => (e) => {
    // prevent navigation when used as a toggle
    e.preventDefault();
    setActiveMega((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <Navbar expand="lg" className="py-3 shadow-sm custom-navbar">
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
          ref={navRef}
        >
          {/* Left info (desktop) */}
          <div className="d-none d-lg-flex align-items-center twin">
            <div className="flexrow2">
              <img src={call} alt="Call" className="fficonrow" />
              <div className="fftext">+91 9461008590</div>
            </div>
            <div className="flexrow2">
              <img src={location} alt="Location" className="fficonrow" />
              <div className="fftext">Bhadwasiya, Jodhpur, Rajasthan, India</div>
            </div>
          </div>

          {/* Center brand + desktop nav */}
          <div className="centerflex">
            <div
              className="mx-auto fs-3 brand-text navbar-brand"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              NAKSHI
            </div>

            <Nav className="d-none d-lg-flex align-items-center">
              <Nav.Link onMouseEnter={() => setActiveMega(null)} href="/">
                Home
              </Nav.Link>

              {/* All Jewellery */}
              <div
                className="mega-trigger"
                onMouseEnter={() => setActiveMega("all")}
                onMouseLeave={() => setActiveMega(null)}
              >
                <Nav.Link href="#" onClick={toggleMega("all")}>
                  All Jewellery
                </Nav.Link>
                <MegaMenu type="all" />
              </div>

              {/* Earrings */}
              <div
                className="mega-trigger"
                onMouseEnter={() => setActiveMega("earrings")}
                onMouseLeave={() => setActiveMega(null)}
              >
                <Nav.Link href="#" onClick={toggleMega("earrings")}>
                  Earrings
                </Nav.Link>
                <MegaMenu type="earrings" />
              </div>

              {/* Rings */}
              <div
                className="mega-trigger"
                onMouseEnter={() => setActiveMega("rings")}
                onMouseLeave={() => setActiveMega(null)}
              >
                <Nav.Link href="#" onClick={toggleMega("rings")}>
                  Rings
                </Nav.Link>
                <MegaMenu type="rings" />
              </div>

              <Nav.Link href="" onMouseEnter={() => setActiveMega(null)}>
                Women
              </Nav.Link>
              <Nav.Link href="" onMouseEnter={() => setActiveMega(null)}>
                Men
              </Nav.Link>
              <Nav.Link href="/shop" onMouseEnter={() => setActiveMega(null)}>
                Shop
              </Nav.Link>
              <Nav.Link href="/about" onMouseEnter={() => setActiveMega(null)}>
                About
              </Nav.Link>
              <Nav.Link href="/contact" onMouseEnter={() => setActiveMega(null)}>
                Contact
              </Nav.Link>
            </Nav>
          </div>

          {/* Right desktop: socials + auth */}
          <div className="d-none d-lg-flex align-items-center twin2">
            <div className="flexrow">
              <img src={fb} alt="Facebook" className="fficonrow" />
              <img src={insta} alt="Instagram" className="fficonrow" />
            </div>

            <div className="d-flex align-items-left ms-3">
              {isLoggedIn ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    id="profile-dropdown"
                    className="d-flex align-items-center border-0 bg-transparent"
                  >
                    <AccountCircleIcon style={{ fontSize: "2rem", color: "#333" }} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate("/account")}>My Account</Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/cart")}>My Cart</Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/orders")}>My Orders</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button id="navbtn" size="sm" onClick={() => navigate("/login")}>
                  Login / Signup
                </Button>
              )}
            </div>
          </div>

          {/* Hamburger (mobile) */}
          <div
            className="d-lg-none ms-2"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setMobilePanel(null);
              setActiveMega(null); // ensure desktop mega closed
            }}
            style={{ cursor: "pointer" }}
          >
            <MenuIcon className="navbar-icons" />
          </div>
        </Container>

        {/* ===== Mobile Menu ===== */}
        {menuOpen && (
          <div className="mobile-menu p-4 text-left d-lg-none">
            {/* Profile icon ABOVE Home (only if logged in) */}
            {isLoggedIn && (
              <button className="mv-profile" onClick={() => setMobilePanel("profile")}>
                <AccountCircleIcon style={{ fontSize: "3.2vh" }} />
                <span>{userName ? userName.split(" ")[0] : "Profile"}</span>
              </button>
            )}

            {/* Main list */}
            {!mobilePanel && (
              <Nav className="flex-column mb-3">
                <Nav.Link onClick={() => { setMenuOpen(false); navigate("/"); }}>
                  Home
                </Nav.Link>

                <button className="mv-link" onClick={() => setMobilePanel("all")}>
                  All Jewellery
                </button>
                <button className="mv-link" onClick={() => setMobilePanel("earrings")}>
                  Earrings
                </button>
                <button className="mv-link" onClick={() => setMobilePanel("rings")}>
                  Rings
                </button>

                <Nav.Link onClick={() => { setMenuOpen(false); navigate("/collections"); }}>
                  Collections
                </Nav.Link>
                <Nav.Link onClick={() => { setMenuOpen(false); navigate("/about"); }}>
                  About
                </Nav.Link>
                <Nav.Link onClick={() => { setMenuOpen(false); navigate("/contact"); }}>
                  Contact
                </Nav.Link>

                {!isLoggedIn && (
                  <Button
                    id="navbtn"
                    size="sm"
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="mt-2"
                  >
                    Login / Signup
                  </Button>
                )}
              </Nav>
            )}

            {/* MV-style panels */}
            {mobilePanel && <MobilePanel type={mobilePanel} />}
          </div>
        )}
      </Navbar>
    </>
  );
}

export default NavbarNakshi;
