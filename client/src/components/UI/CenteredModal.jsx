// src/components/UI/CenteredModal.jsx
// Einfaches zentriertes Modal mit Overlay und Fade‑In‑Animation

export default function CenteredModal({ title, children, onClose }) {
  return (
    <div
      // Vollbild-Overlay
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        backdropFilter: "blur(3px)"
      }}
      onClick={onClose} // Klick auf Overlay schließt Modal
    >
      <div
        // Modal-Container
        style={{
          background: "white",
          borderRadius: "12px",
          width: "480px",
          maxWidth: "90%",
          padding: "28px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          animation: "fadeIn 0.25s ease"
        }}
        onClick={(e) => e.stopPropagation()} // Klick im Modal blockiert Schließen
      >
        <h4 style={{ marginBottom: "20px", fontWeight: 600 }}>{title}</h4>

        {children}

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </div>
    </div>
  );
}
