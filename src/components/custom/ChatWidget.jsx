// 📄 src/components/ChatWidget.jsx
import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import { MessageCircle } from "lucide-react";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>
        {`
          @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .orbit-widget-container:hover .orbit-btn {
            animation: none; transform: scale(1.1);
          }
        `}
      </style>

      {open && <ChatWindow onClose={() => setOpen(false)} />}

      <div
        className="orbit-widget-container"
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 9998,
          gap: "8px",
        }}
      >
        {!open && (
          <span
            onClick={() => setOpen(true)}
            style={{
              background: "white",
              color: "#3b82f6",
              padding: "4px 12px",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "14px",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
              cursor: "pointer",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            Orbit
          </span>
        )}

        <button
          className="orbit-btn"
          onClick={() => setOpen(!open)}
          style={{
            background: "#3b82f6",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
            cursor: "pointer",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
            transition: "transform 0.2s ease",
            animation: "pulse-ring 2s infinite",
          }}
        >
          <MessageCircle color="white" size={30} />
        </button>
      </div>
    </>
  );
};

export default ChatWidget;
