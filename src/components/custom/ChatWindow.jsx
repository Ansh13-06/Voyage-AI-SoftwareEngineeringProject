// // 📄 src/components/custom/ChatWindow.jsx
// import React, { useRef, useEffect, useState } from "react";
// import { MessageCircle, Send, X, Trash2 } from "lucide-react";
// import { useChat } from "../../context/ChatContext";
// import ReactMarkdown from "react-markdown"; // 🔥 1. Import this

// const ChatWindow = ({ onClose }) => {
//   const { messages, sendMessage, isLoading, clearChat } = useChat();

//   const [input, setInput] = useState("");
//   const chatBodyRef = useRef(null);

//   const welcomeMessage = {
//     sender: "bot",
//     text: "Hi! I'm Orbit 🌍. Where are you planning to go today?",
//   };

//   const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

//   useEffect(() => {
//     if (chatBodyRef.current) {
//       chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
//     }
//   }, [messages, isLoading]);

//   const handleSend = async () => {
//     if (!input.trim()) return;
//     const textToSend = input;
//     setInput("");
//     await sendMessage(textToSend);
//   };

//   return (
//     <>
//       <style>
//         {`
//           @keyframes slideUpFade {
//             0% { opacity: 0; transform: translateY(10px) scale(0.98); }
//             100% { opacity: 1; transform: translateY(0) scale(1); }
//           }
//           @keyframes bounce {
//             0%, 80%, 100% { transform: scale(0); }
//             40% { transform: scale(1); }
//           }
//           .message-anim {
//             animation: slideUpFade 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
//           }
//           .typing-dot {
//             width: 6px; height: 6px; background: #9ca3af;
//             border-radius: 50%; display: inline-block;
//             animation: bounce 1.4s infinite ease-in-out both;
//             margin: 0 2px;
//           }
//           .typing-dot:nth-child(1) { animation-delay: -0.32s; }
//           .typing-dot:nth-child(2) { animation-delay: -0.16s; }

//           /* 🔥 Markdown Styles for clean formatting */
//           .markdown-content p {
//             margin: 0 0 8px 0;
//           }
//           .markdown-content p:last-child {
//             margin: 0;
//           }
//           .markdown-content ul, .markdown-content ol {
//             margin: 4px 0 8px 20px;
//             padding: 0;
//           }
//           .markdown-content li {
//             margin-bottom: 4px;
//           }
//           .markdown-content strong {
//             font-weight: 700;
//           }
//         `}
//       </style>

//       <div
//         style={{
//           position: "fixed",
//           bottom: "100px",
//           right: "25px",
//           width: "360px",
//           height: "520px",
//           background: "white",
//           borderRadius: "20px",
//           boxShadow: "0px 12px 24px rgba(0,0,0,0.15)",
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//           zIndex: 9999,
//           fontFamily: "'Inter', sans-serif",
//           border: "1px solid rgba(0,0,0,0.05)",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
//             padding: "16px 20px",
//             color: "white",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <div
//               style={{
//                 background: "rgba(255,255,255,0.2)",
//                 padding: "6px",
//                 borderRadius: "50%",
//                 display: "flex",
//               }}
//             >
//               <MessageCircle size={20} color="white" />
//             </div>
//             <div>
//               <span
//                 style={{
//                   fontWeight: "bold",
//                   fontSize: "16px",
//                   display: "block",
//                 }}
//               >
//                 Orbit
//               </span>
//               <span style={{ fontSize: "12px", opacity: 0.85 }}>
//                 Travel Assistant
//               </span>
//             </div>
//           </div>

//           <div style={{ display: "flex", gap: "10px" }}>
//             {messages.length > 0 && (
//               <button
//                 onClick={clearChat}
//                 style={{
//                   background: "transparent",
//                   border: "none",
//                   cursor: "pointer",
//                   color: "white",
//                   opacity: 0.8,
//                 }}
//                 title="Clear History"
//               >
//                 <Trash2 size={18} />
//               </button>
//             )}
//             <button
//               onClick={onClose}
//               style={{
//                 background: "transparent",
//                 border: "none",
//                 cursor: "pointer",
//                 color: "white",
//               }}
//             >
//               <X size={22} />
//             </button>
//           </div>
//         </div>

//         {/* Chat Body */}
//         <div
//           ref={chatBodyRef}
//           style={{
//             flex: 1,
//             padding: "20px",
//             overflowY: "auto",
//             background: "#f8fafc",
//             display: "flex",
//             flexDirection: "column",
//             gap: "12px",
//           }}
//         >
//           {displayMessages.map((msg, index) => (
//             <div
//               key={index}
//               className="message-anim"
//               style={{
//                 alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
//                 maxWidth: "80%",
//               }}
//             >
//               {msg.sender !== "user" && (
//                 <span
//                   style={{
//                     fontSize: "11px",
//                     color: "#64748b",
//                     marginLeft: "4px",
//                     marginBottom: "4px",
//                     display: "block",
//                   }}
//                 >
//                   Orbit
//                 </span>
//               )}
//               <div
//                 style={{
//                   background: msg.sender === "user" ? "#3b82f6" : "white",
//                   color: msg.sender === "user" ? "white" : "#1e293b",
//                   padding: "12px 16px",
//                   borderRadius:
//                     msg.sender === "user"
//                       ? "18px 18px 4px 18px"
//                       : "18px 18px 18px 4px",
//                   boxShadow:
//                     msg.sender === "user"
//                       ? "0 4px 6px rgba(59, 130, 246, 0.2)"
//                       : "0 2px 4px rgba(0,0,0,0.05)",
//                   fontSize: "14px",
//                   lineHeight: "1.5",
//                   border: msg.sender !== "user" ? "1px solid #e2e8f0" : "none",
//                 }}
//               >
//                 {/* 🔥 Render Markdown for Bot, Plain text for User */}
//                 {msg.sender === "user" ? (
//                   msg.text
//                 ) : (
//                   <div className="markdown-content">
//                     <ReactMarkdown>{msg.text}</ReactMarkdown>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* Typing Indicator */}
//           {isLoading && (
//             <div
//               className="message-anim"
//               style={{ alignSelf: "flex-start", maxWidth: "80%" }}
//             >
//               <span
//                 style={{
//                   fontSize: "11px",
//                   color: "#64748b",
//                   marginLeft: "4px",
//                   marginBottom: "4px",
//                   display: "block",
//                 }}
//               >
//                 Orbit
//               </span>
//               <div
//                 style={{
//                   background: "white",
//                   padding: "12px 16px",
//                   borderRadius: "18px 18px 18px 4px",
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//                   border: "1px solid #e2e8f0",
//                   width: "fit-content",
//                 }}
//               >
//                 <div className="typing-dot"></div>
//                 <div className="typing-dot"></div>
//                 <div className="typing-dot"></div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Input Area */}
//         <div
//           style={{
//             padding: "16px",
//             background: "white",
//             borderTop: "1px solid #f1f5f9",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               background: "#f1f5f9",
//               borderRadius: "28px",
//               padding: "6px 6px 6px 16px",
//               border: "1px solid transparent",
//               transition: "border-color 0.2s",
//             }}
//             onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
//           >
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//               placeholder="Ask Orbit..."
//               disabled={isLoading}
//               style={{
//                 flex: 1,
//                 background: "transparent",
//                 border: "none",
//                 outline: "none",
//                 fontSize: "14px",
//                 color: "#334155",
//                 paddingRight: "10px",
//               }}
//             />
//             <button
//               onClick={handleSend}
//               disabled={!input.trim() || isLoading}
//               style={{
//                 background: input.trim() && !isLoading ? "#3b82f6" : "#cbd5e1",
//                 color: "white",
//                 border: "none",
//                 width: "36px",
//                 height: "36px",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: input.trim() && !isLoading ? "pointer" : "default",
//                 transition: "all 0.2s",
//                 transform: input.trim() ? "scale(1)" : "scale(0.95)",
//               }}
//             >
//               <Send size={18} style={{ marginLeft: "-2px" }} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ChatWindow;
// 📄 src/components/custom/ChatWindow.jsx
import React, { useRef, useEffect, useState } from "react";
import { MessageCircle, Send, X, Trash2 } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import ReactMarkdown from "react-markdown";

const ChatWindow = ({ onClose }) => {
  const { messages, sendMessage, isLoading, clearChat } = useChat();

  const [input, setInput] = useState("");
  const chatBodyRef = useRef(null);

  const welcomeMessage = {
    sender: "bot",
    text: "Hi! I'm Orbit 🌍. Where are you planning to go today?",
  };

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const textToSend = input;
    setInput("");
    await sendMessage(textToSend);
  };

  return (
    <>
      <style>
        {`
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(10px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          .message-anim {
            animation: slideUpFade 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          }
          .typing-dot {
            width: 6px; height: 6px; background: #9ca3af;
            border-radius: 50%; display: inline-block;
            animation: bounce 1.4s infinite ease-in-out both;
            margin: 0 2px;
          }
          .typing-dot:nth-child(1) { animation-delay: -0.32s; }
          .typing-dot:nth-child(2) { animation-delay: -0.16s; }

          /* 🔥 Markdown Styles FIXED */
          .markdown-content p {
            margin: 0 0 8px 0;
          }
          .markdown-content p:last-child {
            margin: 0;
          }
          
          /* ADDED: Specific list styling to override Tailwind resets */
          .markdown-content ul {
            list-style-type: disc !important;
            padding-left: 1.5rem !important;
            margin: 4px 0 8px 0;
          }
          .markdown-content ol {
            list-style-type: decimal !important;
            padding-left: 1.5rem !important;
            margin: 4px 0 8px 0;
          }
          
          .markdown-content li {
            margin-bottom: 4px;
            display: list-item; /* Ensures it behaves like a list item */
          }
          .markdown-content strong {
            font-weight: 700;
          }
        `}
      </style>

      <div
        style={{
          position: "fixed",
          bottom: "100px",
          right: "25px",
          width: "360px",
          height: "520px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0px 12px 24px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 9999,
          fontFamily: "'Inter', sans-serif",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            padding: "16px 20px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "6px",
                borderRadius: "50%",
                display: "flex",
              }}
            >
              <MessageCircle size={20} color="white" />
            </div>
            <div>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  display: "block",
                }}
              >
                Orbit
              </span>
              <span style={{ fontSize: "12px", opacity: 0.85 }}>
                Travel Assistant
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  opacity: 0.8,
                }}
                title="Clear History"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "white",
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div
          ref={chatBodyRef}
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            background: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {displayMessages.map((msg, index) => (
            <div
              key={index}
              className="message-anim"
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
              }}
            >
              {msg.sender !== "user" && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    marginLeft: "4px",
                    marginBottom: "4px",
                    display: "block",
                  }}
                >
                  Orbit
                </span>
              )}
              <div
                style={{
                  background: msg.sender === "user" ? "#3b82f6" : "white",
                  color: msg.sender === "user" ? "white" : "#1e293b",
                  padding: "12px 16px",
                  borderRadius:
                    msg.sender === "user"
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                  boxShadow:
                    msg.sender === "user"
                      ? "0 4px 6px rgba(59, 130, 246, 0.2)"
                      : "0 2px 4px rgba(0,0,0,0.05)",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  border: msg.sender !== "user" ? "1px solid #e2e8f0" : "none",
                }}
              >
                {/* Render Markdown for Bot, Plain text for User */}
                {msg.sender === "user" ? (
                  msg.text
                ) : (
                  <div className="markdown-content">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div
              className="message-anim"
              style={{ alignSelf: "flex-start", maxWidth: "80%" }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  marginLeft: "4px",
                  marginBottom: "4px",
                  display: "block",
                }}
              >
                Orbit
              </span>
              <div
                style={{
                  background: "white",
                  padding: "12px 16px",
                  borderRadius: "18px 18px 18px 4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  border: "1px solid #e2e8f0",
                  width: "fit-content",
                }}
              >
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: "16px",
            background: "white",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#f1f5f9",
              borderRadius: "28px",
              padding: "6px 6px 6px 16px",
              border: "1px solid transparent",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Orbit..."
              disabled={isLoading}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "14px",
                color: "#334155",
                paddingRight: "10px",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              style={{
                background: input.trim() && !isLoading ? "#3b82f6" : "#cbd5e1",
                color: "white",
                border: "none",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() && !isLoading ? "pointer" : "default",
                transition: "all 0.2s",
                transform: input.trim() ? "scale(1)" : "scale(0.95)",
              }}
            >
              <Send size={18} style={{ marginLeft: "-2px" }} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
