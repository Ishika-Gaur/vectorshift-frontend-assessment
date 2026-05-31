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
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        background: "#ffffff",
        padding: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      {handles}
      

      <div
        style={{
          fontWeight: 600,
          marginBottom: "10px",
          borderBottom: "1px solid #eee",
          paddingBottom: "6px",
        }}
      >
        {title}
      </div>

      <div>{children}</div>
    </div>
  );
};