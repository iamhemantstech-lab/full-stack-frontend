import React from "react";
import {
  ActionControls,
  UserProfileCard,
} from "./UnnecessaryReRenderDemo";
import "./ReRenderDemoSection.css";

export default function ReRenderDemoSection() {
  return (
    <div className="demo-section-card">
      <div className="demo-section-header">
        <div className="demo-badge">Live Interactive Playground</div>
        <h3 className="demo-section-title">Context Re-render & State Optimization Demo</h3>
        <p className="demo-section-desc">
          Observe how state updates affect different component render counts in real-time.
        </p>
      </div>

      <div className="demo-grid">
        <UserProfileCard />
        <ActionControls />
      </div>
    </div>
  );
}
