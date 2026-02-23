import React from "react";
import GlitchOverlay from "../components/GlitchOverlay";
import GridBackground from "../components/GridBackground";

export default function Playground() {
    return (
        <div className="min-h-screen bg-black text-white/80 flex flex-col items-center justify-center text-center px-4 py-20">
            <GlitchOverlay />
            <GridBackground />
            <h1
                className="text-4xl font-bold mb-6"
                style={{ fontFamily: "'Space Mono', monospace" }}
            >
                GETBUGED PLAYGROUND
            </h1>
            <p
                className="text-lg text-white/50 mb-12 max-w-2xl"
                style={{ fontFamily: "'Space Mono', monospace" }}
            >
                Welcome to the GetBuged Playground! Here you can select from various levels of buggy code and test your debugging skills. Each level presents unique challenges that will help you improve your ability to identify and fix bugs in code.
            </p>
            <div className="text-white/50 text-xl font-bold">
                Coming soon...
            </div>
        </div>
    )
}   