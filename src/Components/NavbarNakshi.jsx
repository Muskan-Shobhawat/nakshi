import React, { useState } from "react";
import "../CSS/nav.css";
import { Navbar, Nav, Container, Button, Modal } from "react-bootstrap";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../assets/logo.png";
import AuthForm from "./AuthForm"; // The login/signup form component
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

  return (
    <>
      <Navbar expand="lg" className="py-3 shadow-sm custom-navbar">
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
        >
          {/* Left - Logo */}
          <div className="d-flex align-items-center">
            <img
              src={logo}
              alt="Nakshi Logo"
              height="40"
              className="me-2 logo"
            />
          </div>

          {/* Center - Brand Name */}
          <div className="mx-auto fs-3 brand-text navbar-brand">NAKSHI</div>

          {/* Right - Icons & Hamburger */}
          <div className="d-flex align-items-center">
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

            {/* Login/Signup OR Profile */}
            <div className="d-flex align-items-center ms-3">
              {isLoggedIn ? (
                <AccountCircleIcon
                  className="navbar-icons me-2"
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <Button id="navbtn" size="sm" onClick={handleLoginSignupClick}>
                  Login / Signup
                </Button>
              )}
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
