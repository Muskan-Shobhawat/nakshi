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
import AuthForm from "./OTP/AuthForm.jsx"; // Login/Signup form
import { Link } from "react-router-dom";

function NavbarNakshi() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSignupClick = () => {
    setShowAuth(true);
  };

  const handleAuthClose = () => {
    setShowAuth(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Optionally clear token/localStorage here
    localStorage.removeItem("token");
  };

  return (
    <>
      <Navbar expand="lg" className="py-3 shadow-sm custom-navbar">
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
        >
          {/* Left - Logo */}
          <div className="d-flex align-items-center twin">
            {/* <img src={logo} alt="Nakshi Logo" height="40" className="me-2 logo" /> */}
            <div className="flexrow">
              <div>
                <img src={call} alt="" className="fficonrow" />
              </div>
              <div className="fftext">+91 9461008590</div>
            </div>
            <div className="flexrow">
              <div>
                <img src={location} alt="" className="fficonrow" />
              </div>
              <div className="fftext">
                Bhadwasiya, Jodhpur, Rajasthan, India
              </div>
            </div>
          </div>

          {/* Center - Brand Name */}
          <div className="centerflex">
            <div className="mx-auto fs-3 brand-text navbar-brand">NAKSHI</div>
            {/* Desktop Links */}
            <Nav
              className={`d-none d-lg-flex align-items-center ${
                menuOpen ? "show" : ""
              }`}
            >
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

          {/* Right - Icons & Hamburger */}
          <div className="d-flex align-items-center">
            {/* Login/Signup OR Profile Dropdown */}
            <div className="twin2">
              <div className="flexrow">
              <img src={fb} alt="" className="fficonrow" />
              <img src={insta} alt="" className="fficonrow" />
              </div>
              <div className="d-flex align-items-center ms-3">
                {isLoggedIn ? (
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
                  <Button
                    id="navbtn"
                    size="sm"
                    onClick={handleLoginSignupClick}
                  >
                    Login / Signups
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Hamburger */}
            <div
              className="d-lg-none ms-2"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ cursor: "pointer" }}
            >
              <MenuIcon className="navbar-icons" />
            </div>
          </div>
        </Container>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="d-lg-none p-3 text-center">
            <Nav className="flex-column">
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
              {!isLoggedIn && (
                <Nav.Link onClick={handleLoginSignupClick}>
                  Login / Signup
                </Nav.Link>
              )}
            </Nav>
          </div>
        )}
      </Navbar>

      {/* Login/Signup Modal */}
      <Modal show={showAuth} onHide={handleAuthClose} centered>
        <Modal.Body>
          <AuthForm onLoginSuccess={handleLoginSuccess} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NavbarNakshi;
