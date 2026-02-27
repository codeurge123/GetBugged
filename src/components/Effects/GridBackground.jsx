const GridBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none" style={{
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.04) 2px, transparent 2px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 2px, transparent 2px)
    `,
    backgroundSize: "80px 80px",
  }} />
);

export default GridBackground;