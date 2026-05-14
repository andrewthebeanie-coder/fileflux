import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CONVERTERS, CATEGORIES } from "../converters";

export default function Home() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = CONVERTERS.filter(c => {
    const matchCat = active === "All" || c.category === active;
    const matchSearch =
      !search ||
      c.from.toLowerCase().includes(search.toLowerCase()) ||
      c.to.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const popular = CONVERTERS.filter(c => c.popular);

  return (
    <div className="page">
      {/* Hero */}
      <div style={hero}>
        <div style={heroBadge}>⚡ Fast · Free · Private</div>
        <h1 style={heroTitle}>
          Convert any file.<br />
          <span style={{ color: "var(--accent)" }}>Instantly.</span>
        </h1>
        <p style={heroSub}>
          No sign-up. No watermarks. Files processed in your browser session and never stored.
        </p>

        {/* Search */}
        <div style={searchWrap}>
          <span style={searchIcon}>⌕</span>
          <input
            style={searchInput}
            placeholder="Search converters — e.g. mp3, pdf, heic..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Popular */}
      {!search && active === "All" && (
        <section style={{ marginBottom: 56 }}>
          <div style={sectionLabel}>Popular</div>
          <div style={grid}>
            {popular.map(c => <ConverterCard key={c.id} c={c} highlight />)}
          </div>
        </section>
      )}

      {/* All converters */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={sectionLabel}>
            {search ? `Results for "${search}"` : "All Converters"}
          </div>
          <div style={tabs}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                style={{ ...tab, ...(active === cat ? tabActive : {}) }}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={empty}>No converters match your search.</div>
        ) : (
          <div style={grid}>
            {filtered.map(c => <ConverterCard key={c.id} c={c} />)}
          </div>
        )}
      </section>

      {/* Footer note */}
      <div style={footerNote}>
        All files are processed server-side and deleted immediately after conversion. We never store your data.
      </div>
    </div>
  );
}

function ConverterCard({ c, highlight }) {
  return (
    <Link to={`/convert/${c.id}`} style={{ ...card, ...(highlight ? cardHighlight : {}) }}>
      <div style={cardTop}>
        <span style={cardIcon}>{c.icon}</span>
        <span style={cardCategory}>{c.category}</span>
      </div>
      <div style={cardTitle}>
        <span style={fromBadge}>{c.from}</span>
        <span style={arrow}>→</span>
        <span style={toBadge}>{c.to}</span>
      </div>
      <p style={cardDesc}>{c.desc}</p>
      <div style={cardCta}>Convert now →</div>
    </Link>
  );
}

// ---- styles ----

const hero = {
  padding: "80px 0 60px",
  maxWidth: 680,
};
const heroBadge = {
  display: "inline-block",
  background: "var(--accent-glow)",
  color: "var(--accent)",
  border: "1px solid rgba(0,212,255,0.3)",
  borderRadius: 100,
  padding: "4px 14px",
  fontSize: 12,
  letterSpacing: "0.08em",
  marginBottom: 20,
  fontFamily: "'DM Mono', monospace",
};
const heroTitle = {
  fontSize: "clamp(40px, 6vw, 68px)",
  fontFamily: "'Syne', sans-serif",
  fontWeight: 800,
  letterSpacing: "-2px",
  marginBottom: 20,
  lineHeight: 1.05,
};
const heroSub = {
  color: "var(--text2)",
  fontSize: 16,
  marginBottom: 36,
  maxWidth: 480,
  lineHeight: 1.7,
};
const searchWrap = {
  position: "relative",
  maxWidth: 520,
};
const searchIcon = {
  position: "absolute",
  left: 16,
  top: "50%",
  transform: "translateY(-50%)",
  color: "var(--text3)",
  fontSize: 20,
  pointerEvents: "none",
};
const searchInput = {
  width: "100%",
  background: "var(--bg3)",
  border: "1px solid var(--border2)",
  borderRadius: "var(--radius)",
  padding: "14px 16px 14px 44px",
  color: "var(--text)",
  fontSize: 14,
  fontFamily: "'DM Mono', monospace",
  outline: "none",
  transition: "border-color 0.2s",
};

const sectionLabel = {
  fontFamily: "'Syne', sans-serif",
  fontWeight: 700,
  fontSize: 20,
  marginBottom: 20,
  color: "var(--text)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: 16,
};

const card = {
  display: "block",
  background: "var(--bg2)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  padding: "22px 24px",
  transition: "border-color 0.2s, transform 0.2s, background 0.2s",
  cursor: "pointer",
  textDecoration: "none",
  color: "inherit",
};
const cardHighlight = {
  borderColor: "rgba(0,212,255,0.25)",
  background: "linear-gradient(135deg, var(--bg2) 0%, rgba(0,212,255,0.04) 100%)",
};

const cardTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
};
const cardIcon = { fontSize: 22 };
const cardCategory = {
  fontSize: 11,
  color: "var(--text3)",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};
const cardTitle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 12,
};
const fromBadge = {
  background: "var(--bg3)",
  border: "1px solid var(--border2)",
  borderRadius: 6,
  padding: "3px 10px",
  fontSize: 13,
  fontWeight: 500,
  fontFamily: "'DM Mono', monospace",
};
const arrow = { color: "var(--accent)", fontSize: 16 };
const toBadge = {
  background: "rgba(0,212,255,0.1)",
  border: "1px solid rgba(0,212,255,0.25)",
  borderRadius: 6,
  padding: "3px 10px",
  fontSize: 13,
  fontWeight: 500,
  color: "var(--accent)",
  fontFamily: "'DM Mono', monospace",
};
const cardDesc = {
  color: "var(--text2)",
  fontSize: 13,
  lineHeight: 1.6,
  marginBottom: 16,
};
const cardCta = {
  fontSize: 12,
  color: "var(--accent)",
  letterSpacing: "0.05em",
};

const tabs = {
  display: "flex",
  gap: 6,
  flexWrap: "wrap",
};
const tab = {
  background: "var(--bg3)",
  border: "1px solid var(--border)",
  borderRadius: 100,
  padding: "6px 16px",
  fontSize: 13,
  color: "var(--text2)",
  cursor: "pointer",
  fontFamily: "'DM Mono', monospace",
  transition: "all 0.2s",
};
const tabActive = {
  background: "var(--accent-glow)",
  borderColor: "rgba(0,212,255,0.4)",
  color: "var(--accent)",
};

const empty = {
  color: "var(--text3)",
  padding: "60px 0",
  textAlign: "center",
  fontSize: 15,
};

const footerNote = {
  marginTop: 80,
  color: "var(--text3)",
  fontSize: 12,
  textAlign: "center",
  borderTop: "1px solid var(--border)",
  paddingTop: 24,
};
