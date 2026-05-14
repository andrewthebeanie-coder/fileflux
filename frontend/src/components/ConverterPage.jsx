import React, { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { getConverter } from "../converters";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const ACCEPT_MAP = {
  Image:    { "image/*": [] },
  Audio:    { "audio/*": [] },
  Video:    { "video/*": [] },
  Document: { "application/pdf": [] },
};

export default function ConverterPage() {
  const { conversionId } = useParams();
  const converter = getConverter(conversionId);

  const [file, setFile]         = useState(null);
  const [status, setStatus]     = useState("idle"); // idle | converting | done | error
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setStatus("idle");
      setDownloadUrl(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: converter ? ACCEPT_MAP[converter.category] : {},
    maxFiles: 1,
  });

  if (!converter) {
    return (
      <div className="page" style={{ paddingTop: 80, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", marginBottom: 12 }}>Converter not found</h2>
        <Link to="/" style={{ color: "var(--accent)" }}>← Back home</Link>
      </div>
    );
  }

  async function handleConvert() {
    if (!file) return;
    setStatus("converting");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/convert/${conversionId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Conversion failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const disposition = res.headers.get("Content-Disposition") || "";
      const nameMatch = disposition.match(/filename="(.+?)"/);
      const name = nameMatch ? nameMatch[1] : `converted.${converter.to.toLowerCase()}`;

      setDownloadUrl(url);
      setDownloadName(name);
      setStatus("done");
    } catch (e) {
      setErrorMsg(e.message || "Something went wrong.");
      setStatus("error");
    }
  }

  function reset() {
    setFile(null);
    setStatus("idle");
    setDownloadUrl(null);
    setErrorMsg("");
  }

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      {/* Back */}
      <Link to="/" style={backLink}>← All converters</Link>

      {/* Header */}
      <div style={header}>
        <span style={iconWrap}>{converter.icon}</span>
        <div>
          <h1 style={title}>
            {converter.from} → {converter.to}
          </h1>
          <p style={subtitle}>{converter.desc}</p>
        </div>
      </div>

      {/* Ad slot (top) */}
      <div style={adSlot}>
        {/* Google AdSense: replace this div with your AdSense script */}
        <span style={{ color: "var(--text3)", fontSize: 12 }}>Advertisement</span>
      </div>

      {/* Drop zone */}
      {status !== "done" && (
        <div
          {...getRootProps()}
          style={{
            ...dropzone,
            ...(isDragActive ? dropzoneActive : {}),
            ...(file ? dropzoneHasFile : {}),
          }}
        >
          <input {...getInputProps()} />
          {file ? (
            <div style={fileInfo}>
              <div style={fileIconWrap}>📁</div>
              <div>
                <div style={fileName}>{file.name}</div>
                <div style={fileSize}>{(file.size / 1024).toFixed(1)} KB</div>
              </div>
            </div>
          ) : (
            <div style={dropContent}>
              <div style={dropIcon}>⬆</div>
              <div style={dropTitle}>
                {isDragActive ? "Drop it here" : `Drop your ${converter.from} file here`}
              </div>
              <div style={dropSub}>or click to browse</div>
            </div>
          )}
        </div>
      )}

      {/* Convert button */}
      {file && status === "idle" && (
        <button style={convertBtn} onClick={handleConvert}>
          Convert to {converter.to} →
        </button>
      )}

      {/* Converting state */}
      {status === "converting" && (
        <div style={statusBox}>
          <div style={spinner} />
          <span style={{ color: "var(--text2)" }}>Converting your file…</span>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div style={errorBox}>
          <span>⚠ {errorMsg}</span>
          <button style={retryBtn} onClick={reset}>Try again</button>
        </div>
      )}

      {/* Done */}
      {status === "done" && downloadUrl && (
        <div style={doneBox}>
          <div style={doneIcon}>✓</div>
          <div style={doneTitle}>Conversion complete!</div>
          <a href={downloadUrl} download={downloadName} style={downloadBtn}>
            ⬇ Download {converter.to} file
          </a>
          <button style={convertAnotherBtn} onClick={reset}>
            Convert another file
          </button>

          {/* Ad slot (after download) */}
          <div style={{ ...adSlot, marginTop: 32 }}>
            <span style={{ color: "var(--text3)", fontSize: 12 }}>Advertisement</span>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div style={faqSection}>
        <h2 style={faqTitle}>About {converter.from} to {converter.to} conversion</h2>
        <div style={faqItem}>
          <div style={faqQ}>Is this free?</div>
          <div style={faqA}>Yes — Fileflux is completely free with no file limits or sign-up required.</div>
        </div>
        <div style={faqItem}>
          <div style={faqQ}>Are my files safe?</div>
          <div style={faqA}>Your files are sent securely, converted on our server, and deleted immediately after. We never store or share your data.</div>
        </div>
        <div style={faqItem}>
          <div style={faqQ}>What's the max file size?</div>
          <div style={faqA}>Up to 100MB per file. For larger files, consider splitting them first.</div>
        </div>
      </div>
    </div>
  );
}

// ---- styles ----
const backLink = {
  display: "inline-block",
  marginTop: 32,
  marginBottom: 28,
  color: "var(--text2)",
  fontSize: 13,
  letterSpacing: "0.03em",
};
const header = {
  display: "flex",
  alignItems: "flex-start",
  gap: 20,
  marginBottom: 32,
};
const iconWrap = {
  fontSize: 40,
  lineHeight: 1,
  marginTop: 4,
};
const title = {
  fontFamily: "'Syne', sans-serif",
  fontSize: 36,
  fontWeight: 800,
  letterSpacing: "-1px",
  marginBottom: 6,
};
const subtitle = {
  color: "var(--text2)",
  fontSize: 14,
  lineHeight: 1.6,
};
const adSlot = {
  background: "var(--bg2)",
  border: "1px dashed var(--border)",
  borderRadius: "var(--radius)",
  height: 90,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 28,
};
const dropzone = {
  background: "var(--bg2)",
  border: "2px dashed var(--border2)",
  borderRadius: "var(--radius-lg)",
  padding: "56px 32px",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.2s",
  marginBottom: 20,
};
const dropzoneActive = {
  borderColor: "var(--accent)",
  background: "var(--accent-glow)",
};
const dropzoneHasFile = {
  borderStyle: "solid",
  borderColor: "rgba(0,212,255,0.3)",
  background: "rgba(0,212,255,0.04)",
};
const dropContent = {};
const dropIcon = {
  fontSize: 32,
  marginBottom: 12,
  color: "var(--text3)",
};
const dropTitle = {
  fontFamily: "'Syne', sans-serif",
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 6,
};
const dropSub = {
  color: "var(--text2)",
  fontSize: 13,
};
const fileInfo = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  justifyContent: "center",
};
const fileIconWrap = { fontSize: 32 };
const fileName = {
  fontFamily: "'DM Mono', monospace",
  fontSize: 14,
  marginBottom: 4,
};
const fileSize = { color: "var(--text3)", fontSize: 12 };

const convertBtn = {
  width: "100%",
  background: "var(--accent)",
  color: "#000",
  border: "none",
  borderRadius: "var(--radius)",
  padding: "16px 24px",
  fontSize: 15,
  fontWeight: 600,
  fontFamily: "'Syne', sans-serif",
  cursor: "pointer",
  letterSpacing: "0.02em",
  transition: "opacity 0.2s",
  marginBottom: 20,
};

const statusBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  padding: "32px",
  color: "var(--text2)",
};

const spinner = {
  width: 24,
  height: 24,
  border: "2px solid var(--border2)",
  borderTop: "2px solid var(--accent)",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const errorBox = {
  background: "rgba(255,77,109,0.08)",
  border: "1px solid rgba(255,77,109,0.3)",
  borderRadius: "var(--radius)",
  padding: "20px 24px",
  color: "var(--red)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  marginBottom: 20,
};
const retryBtn = {
  background: "none",
  border: "1px solid var(--red)",
  borderRadius: 6,
  color: "var(--red)",
  padding: "6px 14px",
  cursor: "pointer",
  fontSize: 13,
  fontFamily: "'DM Mono', monospace",
};

const doneBox = {
  textAlign: "center",
  padding: "40px 0",
};
const doneIcon = {
  width: 56,
  height: 56,
  background: "rgba(0,229,160,0.1)",
  border: "2px solid var(--green)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
  color: "var(--green)",
  margin: "0 auto 16px",
};
const doneTitle = {
  fontFamily: "'Syne', sans-serif",
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 24,
};
const downloadBtn = {
  display: "inline-block",
  background: "var(--green)",
  color: "#000",
  borderRadius: "var(--radius)",
  padding: "14px 28px",
  fontFamily: "'Syne', sans-serif",
  fontWeight: 700,
  fontSize: 15,
  marginBottom: 16,
  textDecoration: "none",
};
const convertAnotherBtn = {
  display: "block",
  margin: "0 auto",
  background: "none",
  border: "1px solid var(--border2)",
  borderRadius: "var(--radius)",
  color: "var(--text2)",
  padding: "10px 24px",
  cursor: "pointer",
  fontFamily: "'DM Mono', monospace",
  fontSize: 13,
};

const faqSection = {
  marginTop: 56,
  borderTop: "1px solid var(--border)",
  paddingTop: 40,
};
const faqTitle = {
  fontFamily: "'Syne', sans-serif",
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 24,
};
const faqItem = {
  marginBottom: 24,
};
const faqQ = {
  fontFamily: "'Syne', sans-serif",
  fontWeight: 600,
  fontSize: 15,
  marginBottom: 6,
};
const faqA = {
  color: "var(--text2)",
  fontSize: 14,
  lineHeight: 1.7,
};
