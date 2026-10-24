import React from "react";
import ReRenderDemoSection from "../components/ReRenderDemoSection";

export default function DemoPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Context & Re-render Playground
        </h1>
        <p style={{ color: "var(--text, #64748b)" }}>
          Test and analyze how React Context state updates trigger or isolate component renders.
        </p>
      </div>

      <ReRenderDemoSection />
    </div>
  );
}
