// src/nodes/BaseNode.js

export const BaseNode = ({
  title,
  children,
  handles,
  width = 220,
  minHeight = 100,
}) => {
  return (
    <div
      style={{
        width,
        minHeight,
        border: "1px solid rgba(99, 102, 241, 0.15)",
        borderRadius: "14px",
        background: "#ffffff",
        padding: "0",
        boxShadow:
          "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(99, 102, 241, 0.08), 0 0 0 1px rgba(255,255,255,0.8) inset",
        transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
        position: "relative",
        overflow: "visible",
        fontFamily: "'DM Sans', 'Figtree', 'Segoe UI', sans-serif",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 4px 8px rgba(0,0,0,0.08), 0 12px 32px rgba(99, 102, 241, 0.15), 0 0 0 1.5px rgba(99, 102, 241, 0.3) inset";
        e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.35)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(99, 102, 241, 0.08), 0 0 0 1px rgba(255,255,255,0.8) inset";
        e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.15)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Subtle top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "14px",
          right: "14px",
          height: "2px",
          borderRadius: "0 0 2px 2px",
          background: "linear-gradient(90deg, #818cf8, #6366f1, #a5b4fc)",
          opacity: 0.7,
        }}
      />

      {/* Handles sit outside the padded container */}
      {handles}

      {/* Header */}
      <div
        style={{
          padding: "14px 16px 10px 16px",
          borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Title dot accent */}
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #818cf8, #6366f1)",
            flexShrink: 0,
            boxShadow: "0 0 4px rgba(99, 102, 241, 0.5)",
          }}
        />
        <span
          style={{
            fontWeight: 650,
            fontSize: "12px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#374151",
            lineHeight: 1,
          }}
        >
          {title}
        </span>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "12px 16px 14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {children}
      </div>
    </div>
  );
};