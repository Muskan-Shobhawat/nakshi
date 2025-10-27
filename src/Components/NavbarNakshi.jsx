import React, { useState } from "react";
import "../CSS/nav.css";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Modal,
  Dropdown,
} from "react-bootstrap";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../assets/logo.png";
import call from "../assets/call.png";
import location from "../assets/location.png";
import fb from "../assets/fb.png";
import insta from "../assets/insta.png";
import AuthForm from "./OTP/AuthForm.jsx";
import { Link } from "react-router-dom";

function NavbarNakshi() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token") // ✅ auto-login if token exists
  );

  const handleLoginSignupClick = () => setShowAuth(true);
  const handleAuthClose = () => setShowAuth(false);

  // ✅ Triggered when login succeeds in AuthForm
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  return (
    <>
      <Navbar expand="lg" className="py-3 shadow-sm custom-navbar">
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
        >
          {/* Left - Contact Info (visible on desktop only) */}
          <div className="d-none d-lg-flex align-items-center twin">
            <div className="flexrow2">
              <img src={call} alt="Call" className="fficonrow" />
              <div className="fftext">+91 9461008590</div>
            </div>
            <div className="flexrow2">
              <img src={location} alt="Location" className="fficonrow" />
              <div className="fftext">
                Bhadwasiya, Jodhpur, Rajasthan, India
              </div>
            </div>
          </div>

          {/* Center - Brand Name */}
          <div className="centerflex">
            <div className="mx-auto fs-3 brand-text navbar-brand">NAKSHI</div>

            {/* Nav Links (desktop only) */}
            <Nav className="d-none d-lg-flex align-items-center">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/collections">
                Collections
              </Nav.Link>
              <Nav.Link as={Link} to="/shop">
                Shop
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact">
                Contact
              </Nav.Link>
            </Nav>
          </div>

          {/* Right - Social Icons + Auth/Profile (desktop only) */}
          <div className="d-none d-lg-flex align-items-center twin2">
            <div className="flexrow">
              <img src={fb} alt="Facebook" className="fficonrow" />
              <img src={insta} alt="Instagram" className="fficonrow" />
            </div>

            <div className="d-flex align-items-left ms-3">
              {isLoggedIn ? (
                // ✅ Profile Dropdown
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    id="profile-dropdown"
                    className="d-flex align-items-center border-0 bg-transparent"
                  >
                    <AccountCircleIcon
                      style={{ fontSize: "2rem", color: "#333" }}
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/account">
                      My Account
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/cart">
                      My Cart
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/orders">
                      My Orders
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={handleLogout}
                      className="text-danger"
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button id="navbtn" size="sm" onClick={handleLoginSignupClick}>
                  Login / Signup
                </Button>
              )}
            </div>
          </div>

          {/* Hamburger Icon (mobile only) */}
          <div
            className="d-lg-none ms-2"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ cursor: "pointer" }}
          >
            <MenuIcon className="navbar-icons" />
          </div>
        </Container>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="mobile-menu p-4 text-left d-lg-none">
            <Nav className="flex-column mb-3">
              <Nav.Link as={Link} to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/collections"
                onClick={() => setMenuOpen(false)}
              >
                Collections
              </Nav.Link>
              <Nav.Link as={Link} to="/shop" onClick={() => setMenuOpen(false)}>
                Shop
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Nav.Link>
            </Nav>

            {/* Auth Section */}
            {isLoggedIn ? (
              <>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="mb-2"
                >
                  Logout
                </Button>
                <Button
                  variant="outline-dark"
                  size="sm"
                  as={Link}
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                >
                  My Account
                </Button>
              </>
            ) : (
              <Button id="navbtn" size="sm" onClick={handleLoginSignupClick}>
                Login / Signup
              </Button>
            )}

            {/* Contact Info + Social Icons */}
            <div className="mobile-contact mb-3 mt-3">
              <div className="flexrow2 mb-2">
                <img src={call} alt="Call" className="fficonrow" />
                <div className="fftext">+91 9461008590</div>
              </div>
              <div className="flexrow2 mb-3">
                <img src={location} alt="Location" className="fficonrow" />
                <div className="fftext">
                  Bhadwasiya, Jodhpur, Rajasthan, India
                </div>
              </div>
              <div className="flexrow mb-3">
                <img src={fb} alt="Facebook" className="fficonrow" />
                <img src={insta} alt="Instagram" className="fficonrow" />
              </div>
            </div>
          </div>
        )}
      </Navbar>

      {/* ✅ Login/Signup Modal */}
      <Modal show={showAuth} onHide={handleAuthClose} centered>
        <Modal.Body>
          <AuthForm onLoginSuccess={handleLoginSuccess} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NavbarNakshi;
