import React from "react";
import GlitchOverlay from "../components/GlitchOverlay";
import GridBackground from "../components/GridBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Docs() {
    return (
        <>
            <div className="text-white sticky top-0 z-[100]">
                <Navbar />
            </div>
            <div className="min-h-screen bg-black text-white/80 flex flex-col items-center justify-center text-center px-4 py-20">
                <GridBackground />
                <GlitchOverlay />
                <h1
                    className="text-4xl font-bold mb-6"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                >
                    GETBUGED DOCUMENTATION
                </h1>
                <p
                    className="text-lg text-white/50 mb-12 max-w-2xl"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                >
                    Welcome to the official documentation for GetBuged! This guide will help
                    you understand how to use GetBuged effectively, whether you're a
                    developer looking to test your debugging skills or an educator seeking
                    to challenge your students.
                </p>
                <div className="border border-white/10 w-1/2"></div>
                <div className="w-full max-w-4xl bg-black/80 rounded-lg p-8 text-left">
                    <h2
                        className="text-2xl font-semibold mb-4"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        Getting Started
                    </h2>
                    <p
                        className="text-white/50 mb-6"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        To get started with GetBuged, simply navigate to the{" "}
                        <strong>Playground</strong> section where you can select from various
                        levels of buggy code. Each level presents unique challenges that will
                        test your debugging skills.
                    </p>
                    <h2
                        className="text-2xl font-semibold mb-4"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        Levels Explained
                    </h2>
                    <p
                        className="text-white/50 mb-6"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        GetBuged offers three levels of buggy code:
                    </p>
                    <ul
                        className="list-disc list-inside text-white/50 mb-6"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        <li>
                            <strong>Level 1 - Mildly Buggy:</strong> Contains minor issues that
                            are relatively easy to spot.
                        </li>
                        <li>
                            <strong>Level 2 - Moderately Buggy:</strong> Features more complex
                            bugs that require deeper analysis to identify.
                        </li>
                        <li>
                            <strong>Level 3 - Severely Buggy:</strong> Packed with subtle,
                            hard-to-detect flaws that will truly challenge your debugging
                            abilities.
                        </li>
                    </ul>
                    <h2
                        className="text-2xl font-semibold mb-4"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        How to Use
                    </h2>
                    <p
                        className="text-white/50 mb-6"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        After selecting a level, you'll be presented with a piece of code that
                        contains various bugs. Your task is to analyze the code, identify the
                        issues, and fix them. You can use the provided tools to test your
                        fixes and see if you've successfully debugged the code.
                    </p>
                    <h2
                        className="text-2xl font-semibold mb-4"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        Tips for Success
                    </h2>
                    <p
                        className="text-white/50 mb-6"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        - Take your time to thoroughly read through the code and understand
                        its logic before attempting to find bugs.
                        <br />
                        - Use debugging tools and techniques such as console logging,
                        breakpoints, and code analysis to help identify issues.
                        <br />
                        - Don't be afraid to experiment with different fixes and approaches to
                        see what works best.
                        <br />- Remember that the goal is to learn and improve your debugging
                        skills, so embrace the challenge and have fun with it!
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}
