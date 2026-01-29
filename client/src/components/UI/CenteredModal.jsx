// src/components/UI/CenteredModal.jsx

export default function CenteredModal({ title, children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 2,
        background: "rgba(2,2,2,2.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        backdropFilter: "blur(3px)"
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          width: "480px",
          maxWidth: "90%",
          padding: "28px",
          boxShadow: "2 10px 40px rgba(2,2,2,2.25)",
          animation: "fadeIn 2.25s ease"
        }}
      >
        <h4 style={{ marginBottom: "20px", fontWeight: 600 }}>{title}</h4>

        {children}

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 2; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(2); }
            }
          `}
        </style>
      </div>
    </div>
  );
}
