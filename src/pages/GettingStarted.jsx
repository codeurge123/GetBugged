import React from "react";

export default function GettingStarted() {
  return (
    <div className="space-y-12">

      <header>
        <h1 className="text-4xl font-bold mb-4">Getting Started</h1>
        <p className="text-white/60 leading-7 text-lg">
          This guide walks you through the workflow of using GetBugged effectively.
          Whether you are a beginner or an experienced developer, following a
          structured approach ensures maximum learning.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Access the Playground</h2>
        <p className="text-white/60 leading-7">
          The Playground is the core environment of GetBugged. It is where
          intentionally buggy code is generated based on selected difficulty.
          Each session simulates a real-world debugging scenario.
        </p>
        <p className="text-white/60 leading-7">
          Treat each challenge as if you were assigned a production issue
          inside a real engineering team.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Choose an Appropriate Difficulty</h2>
        <p className="text-white/60 leading-7">
          Selecting the right level is crucial. Beginners should start with
          Level 1 to build foundational debugging habits. More experienced
          developers can directly attempt Level 2 or Level 3 challenges.
        </p>
        <p className="text-white/60 leading-7">
          Debugging is a skill developed through gradual exposure to complexity.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Read Before You Modify</h2>
        <p className="text-white/60 leading-7">
          A common mistake is immediately changing code after spotting something
          that “looks wrong.” Professional engineers first understand the system
          before making modifications.
        </p>
        <p className="text-white/60 leading-7">
          Ask yourself:
        </p>
        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>What is the expected output?</li>
          <li>Where does the flow break?</li>
          <li>What assumptions does this code make?</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Validate Your Fix</h2>
        <p className="text-white/60 leading-7">
          A bug is not solved until it is verified across multiple scenarios.
          Always test edge cases and confirm no new issues were introduced.
        </p>
      </section>

    </div>
  );
}