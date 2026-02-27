import React from "react";

export default function HowToUse() {
  return (
    <div className="space-y-10">

      <div>
        <h1 className="text-4xl font-bold mb-4">
          How to Use GetBugged
        </h1>
        <p className="text-white/60 leading-7 text-lg">
          Follow a structured approach to maximize learning from each
          debugging challenge.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Understand Expected Behavior
        </h2>
        <p className="text-white/60 leading-7">
          Before modifying code, clearly understand what the program is
          intended to achieve.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Reproduce the Bug
        </h2>
        <p className="text-white/60 leading-7">
          Make sure you can consistently reproduce the issue. This confirms
          that you understand the problem.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Isolate the Root Cause
        </h2>
        <p className="text-white/60 leading-7">
          Narrow down the faulty logic using console logs, breakpoints,
          and step-by-step reasoning.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Validate the Fix
        </h2>
        <p className="text-white/60 leading-7">
          After fixing, test multiple scenarios including edge cases to ensure
          stability.
        </p>
      </section>

    </div>
  );
}