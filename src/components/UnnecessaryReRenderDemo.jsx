import React, { useRef } from "react";
import { useAppDispatch, useAppState } from "../context/dataContext";

export function UserProfileCard() {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const { user } = useAppState();

  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #3b82f6",
        borderRadius: "8px",
        margin: "1rem 0",
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, color: "#3b82f6" }}>
          👤 User Profile Component
        </h3>
        <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
          Renders: <strong>{renderCount.current}</strong>
        </span>
      </div>
      <p style={{ margin: "0.5rem 0 0.25rem" }}>
        Name: <strong>{user.name}</strong>
      </p>
      <p style={{ margin: "0.25rem 0" }}>
        Notifications: <strong>🔔 {user.notificationsCount}</strong>
      </p>
    </div>
  );
}

export function ActionControls() {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const dispatch = useAppDispatch();

  return (
    <div
      style={{
        padding: "1rem",
        border: "1px dashed #ef4444",
        borderRadius: "8px",
        margin: "1rem 0",
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, color: "#ef4444" }}>
          ⚙️ Actions Only Component
        </h3>
        <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
          Renders: <strong>{renderCount.current}</strong>
        </span>
      </div>
      <p
        style={{
          fontSize: "0.85rem",
          color: "#94a3b8",
          margin: "0.5rem 0 1rem",
        }}
      >
        This component only contains buttons. It doesn't display any data, but
        it re-renders every single time ANY state changes!
      </p>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          style={{
            padding: "0.5rem 0.85rem",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={() => dispatch({ type: "INCRESE_COUNT" })}
        >
          Add Notification (+1)
        </button>

        <button
          style={{
            padding: "0.5rem 0.85rem",
            background: "#8b5cf6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={() =>
            dispatch({
              type: "UPDATE_USER_NAME",
              payload: `John ${Math.floor(Math.random() * 100)}`,
            })
          }
        >
          Randomize Name
        </button>
      </div>
    </div>
  );
}
