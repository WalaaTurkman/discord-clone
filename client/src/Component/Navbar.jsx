import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={styles.navbar}>
      <div style={styles.logo}>💬 ChatApp</div>

      <div style={styles.links}>
        <Link style={styles.link} to="/">Chat</Link>
        <Link style={styles.link} to="/login">Login</Link>
        <Link style={styles.link} to="/register">Register</Link>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    height: "60px",
    background: "#111827",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    color: "white",
  },
  logo: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#22c55e",
  },
  links: {
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "#d1d5db",
    textDecoration: "none",
  },
};

export default Navbar;