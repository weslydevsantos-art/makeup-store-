export default function Loading() {
  return (
    <div
      className="container"
      style={{
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "3px solid var(--color-nude)",
          borderTopColor: "var(--color-terracotta)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p
        style={{
          marginTop: "1rem",
          color: "var(--color-rose)",
          fontFamily: "var(--font-body)",
        }}
      >
        Carregando...
      </p>
    </div>
  );
}
