const GlitchOverlay = ({ active }) => {
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[999] pointer-events-none" style={{
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.015) 2px, rgba(255,0,0,0.015) 4px)",
      animation: "flicker 0.15s infinite alternate",
    }} />
  );
};

export default GlitchOverlay;