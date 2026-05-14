import React from "react";
import { Link, useLocation } from "react-router-dom";

const styles = {
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(8,11,16,0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid var(--border)",
    height: 64,
    display: "flex", alignItems: "center",
    padding: "0 32px",
    justifyContent: "space-between",
  },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 22,
    letterSpacing: "-0.5px",
    display: "flex", alignItems: "center", gap: 8,
  },
  dot: {
    width: 8, height: 8,
    background: "var(--accent)",
    borderRadius: "50%",
    boxShadow: "0 0 12px var(--accent)",
    display: "inline-block",
  },
  links: {
    display: "flex", gap: 32, alignItems: "center",
  },
  link: {
    color: "var(--text2)",
    fontSize: 13,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    transition: "color 0.2s",
  },
};

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <span style={styles.dot} />
        Fileflux
      </Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <a
          href="https://adsense.google.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...styles.link, display: "none" }}
        >
          {/* AdSense placeholder */}
        </a>
      </div>
    </nav>
  );
}
