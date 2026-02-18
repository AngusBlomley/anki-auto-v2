export default function Spinner() {
  return (
    <div
      style={{
        width: 24,
        height: 24,
        border: `3px solid #4f46e520`,
        borderTop: `3px solid #4f46e5`,
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        display: "inline-block",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
