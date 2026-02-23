import React from "react";

const levelBorderColors = {
    1: "border-green-400 hover:border-green-300",
    2: "border-yellow-400 hover:border-yellow-300",
    3: "border-red-400 hover:border-red-300"
};

const LevelCard = ({ level, selected, onClick }) => {
    const borderColorClass = levelBorderColors[level.id];

    return (
        <div
            onClick={onClick}
            className={`
        relative overflow-hidden h-44 p-6 cursor-pointer transition-all duration-200
        border
        ${selected ? borderColorClass : "border-white/10 hover:border-white/30"}
        ${selected ? "bg-white/5" : "bg-transparent"}
      `}
        >
            {/* Chaos Tag */}
            {level.id === 3 && (
                <div className="absolute top-3 right-3 bg-red-600 text-black font-semibold text-[9px] tracking-widest px-2 py-1 font-mono font-bold">
                    YOU WILL SUFFER
                </div>
            )}

            {/* Top Accent Line */}
            {selected && (
                <div
                    className={`
            absolute top-0 left-0 right-0 h-0.5
            ${level.id === 1 ? "bg-green-400" : ""}
            ${level.id === 2 ? "bg-yellow-400" : ""}
            ${level.id === 3 ? "bg-red-400" : ""}
          `}
                />
            )}

            <div className="flex justify-between items-start mb-2.5">
                <span className="text-[9px] tracking-[0.25em] font-mono text-white/70">
                    {level.label}
                </span>

                <span className={`text-lg ${selected ? "opacity-100" : "opacity-40"}`}>
                    {level.icon}
                </span>
            </div>

            <div className="text-white text-xl font-normal mb-1.5 font-serif">
                {level.name}
            </div>

            <div
                className={`
          text-[10px] tracking-widest mb-2.5 font-mono
          ${level.id === 1 ? "text-green-400" : ""}
          ${level.id === 2 ? "text-yellow-400" : ""}
          ${level.id === 3 ? "text-red-400" : ""}
        `}
            >
                {level.tagline}
            </div>

            <p className="text-[10px] leading-[1.7] text-white/35 font-mono">
                {level.desc}
            </p>
        </div>
    );
};

export default LevelCard;