import { useState } from "react";
import { useStore } from "./store";

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/pipelines/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      const data = await response.json();

      alert(
        `Nodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nDAG: ${data.is_dag}`
      );
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 20px",
        fontFamily: "'DM Sans', 'Figtree', 'Segoe UI', sans-serif",
      }}
    >
      <button
        onClick={handleSubmit}
        disabled={loading}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 28px",
          borderRadius: "10px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          background: loading
            ? "linear-gradient(135deg, #a5b4fc, #818cf8)"
            : hovered
            ? "linear-gradient(135deg, #4f46e5, #6366f1, #818cf8)"
            : "linear-gradient(135deg, #6366f1, #818cf8, #a78bfa)",
          backgroundSize: "200% 200%",
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: 650,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          boxShadow: hovered && !loading
            ? "0 6px 20px rgba(99,102,241,0.45), 0 2px 6px rgba(99,102,241,0.2)"
            : "0 2px 8px rgba(99,102,241,0.25), 0 1px 3px rgba(0,0,0,0.08)",
          transform: hovered && !loading ? "translateY(-2px)" : "translateY(0)",
          transition:
            "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease, background 0.2s ease",
          outline: "none",
          minWidth: "160px",
          opacity: loading ? 0.8 : 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Shimmer layer on hover */}
        {hovered && !loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Icon */}
        <span style={{ fontSize: "14px", lineHeight: 1 }}>
          {loading ? "⟳" : "▶"}
        </span>

        {/* Label */}
        <span>{loading ? "Running…" : "Submit Pipeline"}</span>
      </button>

      {/* Node / edge meta hint */}
      {(nodes.length > 0 || edges.length > 0) && (
        <span
          style={{
            marginLeft: "12px",
            fontSize: "10.5px",
            color: "#94a3b8",
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
          }}
        >
          {nodes.length} node{nodes.length !== 1 ? "s" : ""} ·{" "}
          {edges.length} edge{edges.length !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
};